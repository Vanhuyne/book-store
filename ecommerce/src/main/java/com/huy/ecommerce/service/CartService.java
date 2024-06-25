package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.CartDTO;
import com.huy.ecommerce.dtos.CartItemDTO;
import com.huy.ecommerce.entities.Cart;
import com.huy.ecommerce.entities.CartItem;
import com.huy.ecommerce.entities.Product;
import com.huy.ecommerce.entities.User;
import com.huy.ecommerce.exception.ResourceNotFoundException;
import com.huy.ecommerce.exception.UnauthorizedOperationException;
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
@Transactional(rollbackOn = Exception.class)
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
        Product product = cartItem.getProduct();
        return new CartItemDTO(
                cartItem.getCartItemId(),
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                cartItem.getQuantity(),
                product.getThumbnailUrl()
        );
    }

    public void removeCartItem (Long userId ,Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getUser().getUserId().equals(userId)) {
            throw new UnauthorizedOperationException("You are not authorized to remove this item from the cart." + userId);
        }
        Product product = cartItem.getProduct();
        product.setStockQuantity(product.getStockQuantity() + cartItem.getQuantity());
        productRepository.save(product);

        Cart cart = cartItem.getCart();
        cart.getCartItems().remove(cartItem);
        cartItem.setCart(null);
        cartItemRepository.delete(cartItem);
    }

    // clear cart
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));

        cart.getCartItems().stream().forEach(cartItem -> {
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + cartItem.getQuantity());
            productRepository.save(product);
            cartItemRepository.delete(cartItem);
        });

        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    // increase CartItem quantity in cart
    public CartItemDTO increaseCartItemQuantity (Long userId , Long cartItemId){
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        Product product = cartItem.getProduct();


        if (product.getStockQuantity() <= 0) {
            throw new ResourceNotFoundException("Product out of stock");
        }

        cartItem.setQuantity(cartItem.getQuantity() + 1);
        product.setStockQuantity(product.getStockQuantity() - 1);

        productRepository.save(product);
        CartItem updatedCartItem = cartItemRepository.save(cartItem);

        return convertToCartItemDTO(updatedCartItem);

    }

    // decrease CartItem quantity in cart
    public CartItemDTO decreaseCartItemQuantity (Long userId , Long cartItemId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        Product product = cartItem.getProduct();

        if (cartItem.getQuantity() == 1) {
            removeCartItem(userId, cartItemId);
            return null;
        }

        cartItem.setQuantity(cartItem.getQuantity() - 1);
        product.setStockQuantity(product.getStockQuantity() + 1);
        productRepository.save(product);
        CartItem updatedCartItem = cartItemRepository.save(cartItem);

        return convertToCartItemDTO(updatedCartItem);
    }
}
