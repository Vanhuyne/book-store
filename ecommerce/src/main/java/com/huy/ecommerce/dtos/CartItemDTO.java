package com.huy.ecommerce.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CartItemDTO {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private double productPrice;
    private int quantity;
    private String productThumbnailUrl;
}
