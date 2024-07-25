package com.huy.ecommerce.controller;

import com.huy.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/payment-methods")
    public ResponseEntity<List<Object[]>> getPaymentMethodsCount() {
        return ResponseEntity.ok(paymentService.getPaymentMethodsCount());
    }
}
