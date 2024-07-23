package com.huy.ecommerce.controller;

import com.huy.ecommerce.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    @PostMapping("/{productId}/{userId}")
    public ResponseEntity<Void> addRating(@PathVariable Long productId, @PathVariable Long userId,@RequestBody Map<String, Integer> ratingMap) {
        int ratingValue = ratingMap.get("ratingValue");
        ratingService.addRating(productId, userId, ratingValue);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/average/{productId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        double averageRating = ratingService.getAverageRating(productId);
        return ResponseEntity.ok(averageRating);
    }
}
