package com.huy.ecommerce.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductFilterDTO {
    private String name;
    private Double minPrice;
    private Double maxPrice;
    private Integer minStockQuantity;
    private Long categoryId;
    private int page;
    private int size;
}
