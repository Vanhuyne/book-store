package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.UserDTO;
import com.huy.ecommerce.dtos.UserRegistrationDTO;
import com.huy.ecommerce.entities.Role;
import com.huy.ecommerce.entities.Status;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.ResourceConflictException;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.RoleRepository;
import com.huy.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
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
    private final FirebaseStorageService firebaseStorageService;

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
        newUser.setStatus(Status.ACTIVE);

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
        String folderPath = "images/users";
        String fileUrl = firebaseStorageService.uploadFile(file, folderPath);

        if (fileUrl == null) {
            throw new IOException("Failed to upload image.");
        }

        String bucketName = firebaseStorageService.getBucketName();
        String encodedFileUrl = URLEncoder.encode(fileUrl, StandardCharsets.UTF_8.toString());
        String fullUrl = String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucketName, encodedFileUrl);


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setProfilePictureUrl(fullUrl);

        userRepository.save(user);

        return fullUrl;
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
        userDTO.setStatus(user.getStatus());

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
        if (userDTO.getStatus() != null) user.setStatus(userDTO.getStatus());
    }

    private String generateRandomFileName(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }

    public Page<UserDTO> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).map(this::convertToDTO);
    }

    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDTO(user);
    }

    public UserDTO deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setStatus(Status.DELETED);
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    // Update user status
    public UserDTO updateUserStatus(Long userId, Status status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setStatus(status);
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }


    // Additional methods for dashboard functionality

    public List<UserDTO> getRecentUsers(int limit) {
        List<User> recentUsers = userRepository.findTop10ByOrderByCreatedAtDesc();
        return recentUsers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public long getActiveUserCount() {
        return userRepository.countByStatus(Status.ACTIVE);
    }

    public Long getTotalUser(){
        return userRepository.getTotalUsers();
    }

}