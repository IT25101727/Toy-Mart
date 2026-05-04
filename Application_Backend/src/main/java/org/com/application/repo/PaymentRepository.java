package com.org.project.application.repo;

import com.org.project.application.entity.Order;
import com.org.project.application.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    @Query("select p.paymentId from Payment p order by p.paymentId desc ")
    List<String> getLastID();

    boolean existsByOrder(Order order);
}
