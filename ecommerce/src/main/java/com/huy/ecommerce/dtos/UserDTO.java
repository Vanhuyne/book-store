package com.huy.ecommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String address;
    private String phone;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> roles;
}
