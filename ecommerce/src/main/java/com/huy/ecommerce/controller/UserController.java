package com.huy.ecommerce.controller;

import com.huy.ecommerce.dtos.UserDTO;
import com.huy.ecommerce.entities.Status;
import com.huy.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam int page, @RequestParam int size) {
        Page<UserDTO> users = userService.getAllUsers(page, size);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        UserDTO user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<UserDTO> updateUserStatus(@PathVariable Long userId, @RequestParam Status status) {
        UserDTO updatedUser = userService.updateUserStatus(userId, status);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<UserDTO>> getRecentUsers(@RequestParam(defaultValue = "10") int limit) {
        List<UserDTO> recentUsers = userService.getRecentUsers(limit);
        return new ResponseEntity<>(recentUsers, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUserCount() {
        long count = userService.getTotalUser();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/count/active")
    public ResponseEntity<Long> getActiveUserCount() {
        long count = userService.getActiveUserCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
