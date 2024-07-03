package com.huy.ecommerce.controller;

import com.huy.ecommerce.dtos.AuthRequest;
import com.huy.ecommerce.dtos.AuthResponse;
import com.huy.ecommerce.dtos.UserDTO;
import com.huy.ecommerce.dtos.UserRegistrationDTO;
import com.huy.ecommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;

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

        // Proceed with registration logic if validation passes
        userService.register(userDTO);
        return ResponseEntity.ok().build();
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
