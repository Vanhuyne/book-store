package com.huy.ecommerce.service;


import com.huy.ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public List<Object[]> getPaymentMethodsCount() {
        return paymentRepository.getPaymentMethodsCount();
    }
}
