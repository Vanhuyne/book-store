package com.huy.ecommerce.service;

import com.huy.ecommerce.components.JwtService;
import com.huy.ecommerce.components.UserDetailsServiceImpl;
import com.huy.ecommerce.dtos.AuthRequest;
import com.huy.ecommerce.dtos.AuthResponse;
import com.huy.ecommerce.dtos.UserRegistrationDTO;
import com.huy.ecommerce.entities.Role;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.AuthenticationException;
import com.huy.ecommerce.exception.ResourceNotFoundException;
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

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public User register(UserRegistrationDTO userDTO) {
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
        return userRepository.save(newUser);
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


}
