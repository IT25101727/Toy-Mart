package org.com.application.config;

import org.com.application.dto.DtoAdmin;
import org.com.application.service.custom.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminConfig {
    private AdminService adminService;

    @Autowired
    AdminConfig(AdminService adminService) throws Exception {
        this.adminService=adminService;
        addDefultAdmin();
    }

    private void addDefultAdmin() throws Exception {
        if(adminService.getAll().isEmpty()){
            adminService.save(new DtoAdmin("A001","admin","admin"));
        }
    }

}