package com.huy.ecommerce.controller;

import com.huy.ecommerce.dtos.OrderDTO;
import com.huy.ecommerce.dtos.OrdersCountProjection;
import com.huy.ecommerce.service.OrderService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> paymentInfo) {
        try {
            Stripe.apiKey = stripeSecretKey;

            // Ensure the amount is an integer
            Long amount = ((Number) paymentInfo.get("amount")).longValue();

            Map<String, Object> params = new HashMap<>();
            params.put("amount", amount );
            params.put("currency", "usd");
            params.put("payment_method_types", new String[]{"card"});

            // Explicitly request 3D Secure authentication
            Map<String, Object> paymentMethodOptions = new HashMap<>();
            Map<String, Object> cardOptions = new HashMap<>();
            cardOptions.put("request_three_d_secure", "any");
            paymentMethodOptions.put("card", cardOptions);
            params.put("payment_method_options", paymentMethodOptions);

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, String> response = new HashMap<>();
            response.put("client_secret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/total-orders")
    public ResponseEntity<Long> getTotalOrders() {
        return ResponseEntity.ok(orderService.getTotalOrders());
    }

    @GetMapping("/total-revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        return ResponseEntity.ok(orderService.getTotalRevenue());
    }

    @GetMapping("/since")
    public List<OrdersCountProjection> getOrdersCountForLast7Days() {
        return orderService.getOrdersCountForLast7Days();
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orderPage = orderService.getAllOrders(page, size);
        return new ResponseEntity<>(orderPage, HttpStatus.OK);
    }


    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        return ResponseEntity.ok(orderDTO);
    }

    // Update an existing order
    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long orderId, @RequestBody OrderDTO orderDTO) {
        OrderDTO updatedOrder = orderService.updateOrder(orderId, orderDTO);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    // Delete an order
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
