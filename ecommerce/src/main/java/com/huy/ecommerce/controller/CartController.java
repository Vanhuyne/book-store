package com.huy.ecommerce.controller;

import com.huy.ecommerce.dtos.CartDTO;
import com.huy.ecommerce.dtos.CartItemDTO;
import com.huy.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping()
    public ResponseEntity<CartDTO> getCartByUserId(@RequestParam Long userId) {
        CartDTO cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }
    // Add product to cart
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addProductToCart(@RequestParam Long userId,
                                                    @RequestParam Long productId,
                                                    @RequestParam int quantity) {
        CartDTO cart = cartService.addProductToCart(userId, productId, quantity);
            return ResponseEntity.ok(cart);
    }

    // Remove product from cart
    @DeleteMapping("/remove/{userId}/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long userId, @PathVariable Long cartItemId) {
        cartService.removeCartItem(userId ,cartItemId);
        return ResponseEntity.noContent().build();
    }

    //clear cart
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/increaseQuantity/{cartItemId}")
    public ResponseEntity<CartItemDTO> increaseCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {
        CartItemDTO updatedCartItem = cartService.increaseCartItemQuantity(userId, cartItemId);
        return ResponseEntity.ok(updatedCartItem);
    }

    @PostMapping("/{userId}/decreaseQuantity/{cartItemId}")
    public ResponseEntity<CartItemDTO> decreaseCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {
        CartItemDTO updatedCartItem = cartService.decreaseCartItemQuantity(userId, cartItemId);
        return ResponseEntity.ok(updatedCartItem);
    }


}
