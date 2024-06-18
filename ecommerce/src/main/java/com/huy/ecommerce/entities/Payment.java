package com.huy.ecommerce.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(mappedBy = "payment")
    private Order order;
    private String payerId;    // PayerId of paypal (e.g., "PayPal")
    private String paymentStatus;    // Payment method (e.g., "PayPal")

    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentTime;

}

