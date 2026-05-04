package org.com.application.repo;

import org.com.application.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    @Query("SELECT c.customerId FROM Customer c ORDER BY c.customerId DESC")
    List<String> getLastID();

    boolean existsByEmail(String email);


}
