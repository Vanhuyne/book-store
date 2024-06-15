package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.CartDTO;
import com.huy.ecommerce.dtos.CartItemDTO;
import com.huy.ecommerce.entities.Cart;
import com.huy.ecommerce.entities.CartItem;
import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.repository.CartItemRepository;
import com.huy.ecommerce.repository.CartRepository;
import com.huy.ecommerce.repository.ProductRepository;
import com.huy.ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public CartDTO getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        return convertToCartDTO(cart);
    }
    @Transactional
    public CartDTO addProductToCart(Long userId, Long productId, int quantity) {
        //fetch user by id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        //fetch or create cart for user
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setCreatedAt(LocalDateTime.now());
                    newCart.setCartItems(new HashSet<>());
                    return newCart;
                });

        // Fetch product by productId
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check stock availability
        if (product.getStockQuantity() < quantity) {
            throw new ResourceNotFoundException("Product out of stock");
        }

        // Find existing cart item
        Optional<CartItem> existingCartItem  = cart.getCartItems().stream()
                .filter(cartItem -> cartItem.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingCartItem.isPresent()) {
            // Update existing cart item
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }else {
            // Create new cart item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setCreatedAt(LocalDateTime.now());
            cartItem.setQuantity(quantity);
            cart.getCartItems().add(cartItem);
        }

        // Update cart
        product.setStockQuantity(product.getStockQuantity() - quantity);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
        cartRepository.save(cart);

        return convertToCartDTO(cart);
    }

    private CartDTO convertToCartDTO(Cart cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getCartId());
        cartDTO.setUserId(cart.getUser().getUserId());

        Set<CartItemDTO> cartItemDTOs = cart.getCartItems().stream()
                .map(this::convertToCartItemDTO)
                .collect(Collectors.toSet());
        cartDTO.setCartItems(cartItemDTOs);

        return cartDTO;
    }

    private CartItemDTO convertToCartItemDTO(CartItem cartItem) {
        CartItemDTO cartItemDTO = new CartItemDTO();
        cartItemDTO.setCartItemId(cartItem.getCartItemId());
        cartItemDTO.setProductId(cartItem.getProduct().getProductId());
        cartItemDTO.setProductName(cartItem.getProduct().getName());
        cartItemDTO.setProductPrice(cartItem.getProduct().getPrice());
        cartItemDTO.setQuantity(cartItem.getQuantity());
        return cartItemDTO;
    }
}
