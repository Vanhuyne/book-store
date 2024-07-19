package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.UserDTO;
import com.huy.ecommerce.dtos.UserRegistrationDTO;
import com.huy.ecommerce.entities.Role;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.ResourceConflictException;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.RoleRepository;
import com.huy.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    public void register(UserRegistrationDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new ResourceConflictException("Username is already taken!");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResourceConflictException("Email is already in use!");
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

    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return convertToDTO(user);
    }

    public UserDTO getCurrentUser() {
        String username = getCurrentUsername();
        return findByUsername(username);
    }

    public UserDTO updateProfile(UserDTO userDTO) {
        String currentUsername = getCurrentUsername();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!user.getUsername().equals(userDTO.getUsername()) &&
                userRepository.existsByUsername(userDTO.getUsername())) {
            throw new ResourceConflictException("Username is already taken.");
        }

        if (!user.getEmail().equals(userDTO.getEmail()) &&
                userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ResourceConflictException("Email is already in use.");
        }

        updateUserFields(user, userDTO);

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return convertToDTO(user);
    }

    public String uploadProfilePicture(MultipartFile file, Long userId) throws IOException {
        String uploadDir = "./uploads/users/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String randomFileName = generateRandomFileName(file.getOriginalFilename());
        Path filePath = uploadPath.resolve(randomFileName);
        Files.copy(file.getInputStream(), filePath);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        user.setProfilePictureUrl(randomFileName);

        userRepository.save(user);

        return randomFileName;
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

    private void updateUserFields(User user, UserDTO userDTO) {
        if (userDTO.getUsername() != null) user.setUsername(userDTO.getUsername());
        if (userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if (userDTO.getFirstName() != null) user.setFirstName(userDTO.getFirstName());
        if (userDTO.getLastName() != null) user.setLastName(userDTO.getLastName());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());
        if (userDTO.getProfilePictureUrl() != null) user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
    }

    private String generateRandomFileName(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }
}