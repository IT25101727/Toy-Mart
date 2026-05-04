package org.com.application.repo;


import org.com.application.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    @Query("SELECT a.adminId FROM Admin a ORDER BY a.adminId DESC")
    List<String> getLastID();

    boolean existsByUserName(String userName);


}

