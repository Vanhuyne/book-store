package com.huy.ecommerce.dtos;

import lombok.*;


public interface OrdersCountProjection {
    String getDate();
    Long getCount();
}
