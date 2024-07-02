package com.huy.ecommerce.controller;

import com.huy.ecommerce.components.JwtService;
import com.huy.ecommerce.dtos.AuthRequest;
import com.huy.ecommerce.dtos.AuthResponse;
import com.huy.ecommerce.dtos.UserDTO;
import com.huy.ecommerce.dtos.UserRegistrationDTO;
import com.huy.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO userDTO) {
        userService.register(userDTO);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) throws Exception{
        AuthResponse authResponse = userService.login(authRequest);
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        UserDTO userDTO = userService.findByUsername(username);
        return ResponseEntity.ok(userDTO);
    }
}
