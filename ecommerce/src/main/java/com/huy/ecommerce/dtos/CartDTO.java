package com.huy.ecommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long cartId;
    private Long userId;
    private boolean processed;
    private Set<CartItemDTO> cartItems;
}
