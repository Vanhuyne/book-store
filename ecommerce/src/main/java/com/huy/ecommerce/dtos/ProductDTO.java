package com.huy.ecommerce.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;

    @Positive
    private double price;

    @Min(0)
    private int stockQuantity;

    @Size(max = 255)
    private String thumbnailUrl;

    private Long categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<PhotoDTO> photoUrls;
}
