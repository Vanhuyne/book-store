package com.huy.ecommerce.repository;

import com.huy.ecommerce.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COUNT(o) FROM Order o")
    Long getTotalOrders();

    @Query("SELECT SUM(o.total) FROM Order o")
    Double getTotalRevenue();

    @Query("SELECT MONTH(o.createdAt), COUNT(o) FROM Order o GROUP BY MONTH(o.createdAt)")
    List<Object[]> countOrdersPerMonth();

}
