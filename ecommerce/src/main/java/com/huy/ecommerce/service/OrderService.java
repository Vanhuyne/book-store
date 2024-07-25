package com.huy.ecommerce.service;

import com.huy.ecommerce.dtos.OrderDTO;
import com.huy.ecommerce.dtos.OrderItemDTO;
import com.huy.ecommerce.dtos.PaymentDTO;
import com.huy.ecommerce.entities.*;
import com.huy.ecommerce.exception.ResourceNotFoundException;

import com.huy.ecommerce.repository.PaymentRepository;
import com.huy.ecommerce.repository.CartRepository;
import com.huy.ecommerce.repository.OrderItemRepository;
import com.huy.ecommerce.repository.OrderRepository;
import com.huy.ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;


    private OrderDTO convertToDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setUserId(order.getUser().getUserId());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setShippingName(order.getShippingName());
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setShippingCity(order.getShippingCity());
        orderDTO.setShippingPostalCode(order.getShippingPostalCode());
        orderDTO.setSubtotal(order.getSubtotal());
        orderDTO.setTax(order.getTax());
        orderDTO.setTotal(order.getTotal());
        orderDTO.setCreatedAt(order.getCreatedAt());
        orderDTO.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProductName(item.getProductName());
            itemDTO.setProductThumbnailUrl(item.getProductThumbnailUrl());
            itemDTO.setProductPrice(item.getProductPrice());
            itemDTO.setQuantity(item.getQuantity());
            return itemDTO;
        }).collect(Collectors.toList());
        orderDTO.setOrderItems(orderItemDTOs);

        Payment payment = order.getPayment();
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaymentMethod(payment.getPaymentMethod());
        paymentDTO.setPaymentStatus(payment.getPaymentStatus());
        paymentDTO.setAmount(payment.getAmount());

        orderDTO.setPayment(paymentDTO);

        return orderDTO;
    }
    // Create order
    @Transactional
    public OrderDTO createOrder (OrderDTO orderDTO){
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + orderDTO.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(orderDTO.getStatus());
        order.setShippingName(orderDTO.getShippingName());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setShippingCity(orderDTO.getShippingCity());
        order.setShippingPostalCode(orderDTO.getShippingPostalCode());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        order.setSubtotal(orderDTO.getSubtotal());
        order.setTax(orderDTO.getTax());
        order.setTotal(orderDTO.getTotal());

        // Set payment details
        Payment paymentDetails = new Payment();
        paymentDetails.setPaymentMethod(orderDTO.getPayment().getPaymentMethod());
        paymentDetails.setPaymentStatus(orderDTO.getPayment().getPaymentStatus());
        paymentDetails.setAmount(orderDTO.getPayment().getAmount());
        paymentDetails.setPaymentTime(new Date());
        paymentRepository.save(paymentDetails);

        order.setPayment(paymentDetails);

        // Save the order and order items
        orderRepository.save(order);

        List<OrderItem> orderItems = orderDTO.getOrderItems().stream().map(dto -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductName(dto.getProductName());
            item.setProductThumbnailUrl(dto.getProductThumbnailUrl());
            item.setProductPrice(dto.getProductPrice());
            item.setQuantity(dto.getQuantity());
            return item;
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        order.setOrderItems(orderItems);

        Cart cart = user.getCart();
        if (cart != null) {
            cartRepository.save(cart);
        }
        // Convert the saved order entity back to OrderDTO
        OrderDTO savedOrderDTO = convertToDTO(order);

        return savedOrderDTO;
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    public List<Long> getMonthlyOrders() {
        List<Object[]> results = orderRepository.countOrdersPerMonth();
        List<Long> monthlyOrders = results.stream()
                .map(result -> ((Number) result[1]).longValue())
                .collect(Collectors.toList());
        return monthlyOrders;
    }
}
