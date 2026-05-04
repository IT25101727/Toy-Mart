package org.com.application.repo;

import org.com.application.entity.Product;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("select p.id from Product p order by p.id desc ")
    List<String> getLastID();

    boolean existsByName(String name);

    @NullMarked
    Optional<Product> findById(String id);

}
