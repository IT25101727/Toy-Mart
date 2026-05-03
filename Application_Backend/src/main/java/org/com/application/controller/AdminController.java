package org.com.application.controller;


import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoAdmin;
import org.com.application.service.custom.AdminService;
import org.com.application.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    // 🔹 Get all admins
    @GetMapping
    public ResponseEntity<APIResponse<List<DtoAdmin>>> getAllAdmins() throws Exception {
        List<DtoAdmin> admins= adminService.getAll();
        return ResponseEntity.ok(
                new APIResponse<>(200, "Admins fetched successfully", admins)
        );
    }

    // 🔹 Get admin by ID
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<DtoAdmin>> getAdminById(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"admin found",adminService.find(id)),HttpStatus.ACCEPTED);
    }

    // 🔹 Create new admin
    @PostMapping
    public ResponseEntity<APIResponse<DtoAdmin>> createAdmin(@RequestBody DtoAdmin adminDTO) throws Exception {
         DtoAdmin dtoAdmin=adminService.save(adminDTO);
         return new ResponseEntity<>(new APIResponse<>(201,"admin saved",dtoAdmin),HttpStatus.CREATED);
    }

    // 🔹 Update admin
    @PutMapping
    public ResponseEntity<APIResponse<DtoAdmin>> updateAdmin(@RequestBody DtoAdmin adminDTO) throws Exception {
        DtoAdmin dtoAdmin=adminService.update( adminDTO);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Admins updated successfully", dtoAdmin)
        );
    }

    // 🔹 Delete admin
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteAdmin(@PathVariable String id) throws Exception {
         adminService.delete(id);
         return  ResponseEntity.ok(
                 new APIResponse<>(200,"admin deleted successfully",null)
         );
    }
}