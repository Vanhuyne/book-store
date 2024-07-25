package com.huy.ecommerce.repository;

import com.huy.ecommerce.entities.Status;
import com.huy.ecommerce.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findTop10ByOrderByCreatedAtDesc();

    Long countByStatus(Status status);

    @Query("SELECT COUNT(u) FROM User u")
    Long getTotalUsers();
}
