package com.huy.ecommerce.controller;

import com.huy.ecommerce.dtos.OrderDTO;
import com.huy.ecommerce.service.OrderService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    // create Order
    @PostMapping("/place-order")
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO savedOrderDTO  = orderService.createOrder(orderDTO);
        return new ResponseEntity<>(savedOrderDTO, HttpStatus.CREATED);
    }

    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentInfo) {
        try {
            Stripe.apiKey = stripeSecretKey;

            Map<String, Object> chargeParams = new HashMap<>();
            chargeParams.put("amount", paymentInfo.get("amount"));
            chargeParams.put("currency", "usd");
            chargeParams.put("source", paymentInfo.get("token"));
            chargeParams.put("description", "Charge for order");

            Charge charge = Charge.create(chargeParams);

            // If the charge is successful, you can update the order status or perform other actions
            if (charge.getStatus().equals("succeeded")) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "succeeded");
                response.put("chargeId", charge.getId());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                        .body(Map.of("status", "failed", "message", "Payment was unsuccessful"));
            }
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

}
