package com.huy.ecommerce.service;

import com.huy.ecommerce.components.JwtService;
import com.huy.ecommerce.components.UserDetailsServiceImpl;
import com.huy.ecommerce.dtos.*;
import com.huy.ecommerce.entities.PasswordResetToken;
import com.huy.ecommerce.entities.Role;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.AuthenticationException;
import com.huy.ecommerce.exception.ResourceConflictException;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.PasswordResetTokenRepository;
import com.huy.ecommerce.repository.RoleRepository;
import com.huy.ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;


    public void register(UserRegistrationDTO userDTO) {
       if (userRepository.existsByUsername(userDTO.getUsername())) {
           throw new ResourceNotFoundException("Username is already taken!");
       }

       if (userRepository.existsByEmail(userDTO.getEmail())) {
           throw new ResourceNotFoundException("Email is already in use!");
       }

       User newUser = new User();
       newUser.setUsername(userDTO.getUsername());
       newUser.setEmail(userDTO.getEmail());
       newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
       newUser.setFirstName(userDTO.getFirstName());
       newUser.setLastName(userDTO.getLastName());
       newUser.setCreatedAt(LocalDateTime.now());
       newUser.setUpdatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));

        newUser.setRoles(Set.of(userRole));

        mailService.sendWelcomeEmail(newUser.getEmail(), newUser.getFirstName());
        userRepository.save(newUser);

    }

    public AuthResponse login(AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(), authRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt);
    }

    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return convertToDTO(user);
    }

    // request PasswordReset
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Check if there is already an existing token
        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user).orElse(null);

        // Generate a new token
        String resetToken = jwtService.generateToken(user);

        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);

        if (existingToken == null) {
            // No existing token, create a new one
            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setToken(resetToken);
            passwordResetToken.setUser(user);
            passwordResetToken.setExpiryDate(expiryDate);

            passwordResetTokenRepository.save(passwordResetToken);
        } else {
            // Update existing token with new token value and reset expiry date
            existingToken.setToken(resetToken);
            existingToken.setExpiryDate(expiryDate);

            passwordResetTokenRepository.save(existingToken);
        }

        mailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());
    }

    // reset Password
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid reset token"));

        User user = passwordResetToken.getUser();

        if (!jwtService.isTokenValid(token, user)) {
            throw new AuthenticationException("Invalid or expired token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove the used token
        passwordResetTokenRepository.delete(passwordResetToken);
        user.setPasswordResetToken(null);
        userRepository.save(user);
    }

    public UserDTO getCurrentUser() {
        String username = getCurrentUsername();
        return findByUsername(username);
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setAddress(user.getAddress());
        userDTO.setPhone(user.getPhone());
        userDTO.setProfilePictureUrl(user.getProfilePictureUrl());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setUpdatedAt(user.getUpdatedAt());

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        userDTO.setRoles(roles);
        return userDTO;
    }

    @Transactional
    public UserDTO updateProfile(UserDTO userDTO ) {
        String currentUsername = getCurrentUsername();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(userDTO.getUsername()) &&
                userRepository.existsByUsername(userDTO.getUsername())) {
            throw new ResourceConflictException("Username is already taken.");
        }

        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userDTO.getEmail()) &&
                userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResourceConflictException("Email is already in use.");
        }
        // Update user details (only if provided in the DTO)
        if (userDTO.getUsername() != null) user.setUsername(userDTO.getUsername());
        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        if (userDTO.getProfilePictureUrl() != null) user.setProfilePictureUrl(userDTO.getProfilePictureUrl());

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return convertToDTO(user);
    }

    public String uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        // Handle file
        String uploadDir = "./uploads/users/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        // Generate random file name
        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null) {
            throw new IllegalArgumentException("Original filename cannot be null");
        }
        String originalFileName = StringUtils.cleanPath(originalFilename);

        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String randomFileName = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(randomFileName);
        Files.copy(file.getInputStream(), filePath);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setProfilePictureUrl(randomFileName);

        userRepository.save(user);

        return randomFileName;
    }

}
