package com.huy.ecommerce.service;

import com.huy.ecommerce.components.JwtService;
import com.huy.ecommerce.dtos.AuthRequest;
import com.huy.ecommerce.dtos.AuthResponse;
import com.huy.ecommerce.entities.PasswordResetToken;
import com.huy.ecommerce.entities.Role;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.AuthenticationException;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.PasswordResetTokenRepository;
import com.huy.ecommerce.repository.RoleRepository;
import com.huy.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService{
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;

    public AuthResponse login(AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authRequest.getUsername(), authRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Incorrect username or password");
        }

        final UserDetails userDetails = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        final String jwt = jwtService.generateToken(userDetails);

        return new AuthResponse(jwt);
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        PasswordResetToken existingToken = passwordResetTokenRepository.findByUser(user).orElse(null);

        String resetToken = jwtService.generateToken(user);
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);

        if (existingToken == null) {
            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setToken(resetToken);
            passwordResetToken.setUser(user);
            passwordResetToken.setExpiryDate(expiryDate);

            passwordResetTokenRepository.save(passwordResetToken);
        } else {
            existingToken.setToken(resetToken);
            existingToken.setExpiryDate(expiryDate);

            passwordResetTokenRepository.save(existingToken);
        }

        mailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Invalid reset token"));

        User user = passwordResetToken.getUser();

        if (!jwtService.isTokenValid(token, user)) {
            throw new AuthenticationException("Invalid or expired token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(passwordResetToken);
        user.setPasswordResetToken(null);
        userRepository.save(user);
    }

    public AuthResponse authenticateWithGoogle(String email, String name, String pictureUrl) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, name, pictureUrl));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    private User createGoogleUser(String email, String name, String pictureUrl) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUsername(name);

        String password = generateRandomPassword();
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setFirstName(name.split(" ")[0]);
        newUser.setLastName(name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : "");
        newUser.setProfilePictureUrl(pictureUrl);
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role not found."));

        newUser.setRoles(Set.of(userRole));

        User savedUser = userRepository.save(newUser);
        mailService.sendGoogleUserCredentials(email, savedUser.getUsername(), password);
        return savedUser;
    }

    private String generateRandomPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 20);
    }

}