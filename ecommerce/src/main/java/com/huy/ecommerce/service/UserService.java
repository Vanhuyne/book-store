package com.huy.ecommerce.service;

import com.huy.ecommerce.components.JwtService;
import com.huy.ecommerce.components.UserDetailsServiceImpl;
import com.huy.ecommerce.dtos.AuthRequest;
import com.huy.ecommerce.dtos.AuthResponse;
import com.huy.ecommerce.dtos.UserDTO;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final UserDetailsServiceImpl userDetailsService;

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


}
