package com.huy.ecommerce.repository;

import com.huy.ecommerce.dtos.OrdersCountProjection;
import com.huy.ecommerce.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT COUNT(o) FROM Order o")
    Long getTotalOrders();

    @Query("SELECT SUM(o.total) FROM Order o")
    Double getTotalRevenue();

    @Query("SELECT FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d') as date, COUNT(o) as count " +
            "FROM Order o WHERE o.createdAt >= :sevenDaysAgo " +
            "GROUP BY FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d') " +
            "ORDER BY FUNCTION('DATE_FORMAT', o.createdAt, '%Y-%m-%d')")
    List<OrdersCountProjection> countOrdersGroupedByDayInLast7Days(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);


}
