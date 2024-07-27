package com.huy.ecommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDTO {
    private Long orderId;
    private Long userId;
    private List<OrderItemDTO> orderItems;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String status;
    private String shippingName;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PaymentDTO payment;
}
