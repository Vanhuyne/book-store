package com.huy.ecommerce.repository;

import com.huy.ecommerce.entities.Cart;
import com.huy.ecommerce.entities.CartItem;
import com.huy.ecommerce.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
