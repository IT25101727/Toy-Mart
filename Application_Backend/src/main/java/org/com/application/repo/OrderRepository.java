package org.com.application.repo;

import org.com.application.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,String> {

    @Query("SELECT o.orderId FROM orders o ORDER BY o.orderId DESC")
    List<String> getLastID();



}
