package com.huy.ecommerce.service;

import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.entities.Rating;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.ProductRepository;
import com.huy.ecommerce.repository.RatingRepository;
import com.huy.ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public void addRating(Long productId, Long userId, int ratingValue) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Rating rating = new Rating();
        rating.setProduct(product);
        rating.setUser(user);
        rating.setRatingValue(ratingValue);
        rating.setCreatedAt(LocalDateTime.now());
        rating.setUpdatedAt(LocalDateTime.now());

        ratingRepository.save(rating);
    }

    public double getAverageRating(Long productId) {
        List<Rating> ratings = ratingRepository.findByProductProductId(productId);
        return ratings.stream()
                .mapToInt(Rating::getRatingValue)
                .average()
                .orElse(0.0);
    }
}
