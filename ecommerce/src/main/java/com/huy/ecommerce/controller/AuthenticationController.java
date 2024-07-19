package com.huy.ecommerce.controller;

import com.google.gson.Gson;
import com.huy.ecommerce.dtos.*;
import com.huy.ecommerce.service.AuthenticationService;
import com.huy.ecommerce.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.TypeToken;
import org.slf4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private static final Path UPLOAD_DIR = Paths.get("./uploads/users").toAbsolutePath().normalize();

    Logger logger = org.slf4j.LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Prepare error messages from binding result
            StringBuilder errorMessages = new StringBuilder();
            bindingResult.getFieldErrors().forEach(error -> {
                errorMessages.append(error.getDefaultMessage()).append("; ");
            });
            return ResponseEntity.badRequest().body(errorMessages.toString());
        }

        userService.register(userDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        AuthResponse authResponse = authenticationService.login(authRequest);
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        UserDTO userDTO = userService.findByUsername(username);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        authenticationService.requestPasswordReset(email);
        return ResponseEntity.ok("Password reset email sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        authenticationService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password has been reset");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile() {
        UserDTO userDTO = userService.getCurrentUser();
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/profile-picture")
    public ResponseEntity<String> updateProfile(@RequestParam("file") MultipartFile file , Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDTO userDTO = userService.findByUsername(userDetails.getUsername());
            String fileDownloadUri = userService.uploadProfilePicture(file , userDTO.getUserId());
            return ResponseEntity.ok(fileDownloadUri);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile: " + e.getMessage());
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path filePath = UPLOAD_DIR.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserDTO userDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Prepare error messages from binding result
            StringBuilder errorMessages = new StringBuilder();
            bindingResult.getFieldErrors().forEach(error -> {
                errorMessages.append(error.getDefaultMessage()).append("; ");
            });
            return ResponseEntity.badRequest().body(errorMessages.toString());
        }

        try {
            UserDTO updatedUserDTO = userService.updateProfile(userDTO);
            return ResponseEntity.ok(updatedUserDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update profile: " + e.getMessage());
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest googleLoginRequest) {
        logger.info("Received Google login request");
        if (googleLoginRequest == null || googleLoginRequest.getIdToken() == null) {
            logger.error("Google login request or ID token is null");
            return ResponseEntity.badRequest().build();
        }
        logger.info("Google ID token received: " + googleLoginRequest.getIdToken().substring(0, 20) + "...");

        try {
            // Decode the token
            Map<String, Object> payload = decodeGoogleIdToken(googleLoginRequest.getIdToken());

            // Extract necessary information from the payload
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            logger.info("Token decoded successfully. Email: " + email);

            // Authenticate the user
            AuthResponse authResponse = authenticationService.authenticateWithGoogle(email, name, pictureUrl);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Error during Google token decoding: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthResponse("Error during Google authentication"));
        }
    }

    private Map<String, Object> decodeGoogleIdToken(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token format");
        }

        String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

        Gson gson = new Gson();
        TypeToken<Map<String, Object>> mapType = new TypeToken<Map<String, Object>>() {};
        Map<String, Object> payloadMap = gson.fromJson(payload, mapType.getType());

        logger.info("Decoded payload: " + payloadMap.toString());

        return payloadMap;
    }

}


