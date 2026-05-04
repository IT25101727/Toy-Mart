package org.com.application.controller;

import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoCustomer;
import org.com.application.service.custom.CustomerService;
import org.com.application.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<APIResponse<List<DtoCustomer>>> getAllCustomers() throws Exception {
        List<DtoCustomer> customers = customerService.getAll();
        return ResponseEntity.ok(
                new APIResponse<>(200, "customers fetched successfully", customers)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<DtoCustomer>> getCustomerById(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"customer found",customerService.find(id)),HttpStatus.ACCEPTED);
    }


    @PostMapping
    public ResponseEntity<APIResponse<DtoCustomer>> createCustomer(@RequestBody DtoCustomer dtoCustomer) throws Exception {
         DtoCustomer dtocuz=customerService.save(dtoCustomer);
         return new ResponseEntity<>(new APIResponse<>(201,"customer saved",dtocuz),HttpStatus.CREATED);
    }


    @PutMapping
    public ResponseEntity<APIResponse<DtoCustomer>> updateCustomer(@RequestBody DtoCustomer dtoCustomer) throws Exception {
        DtoCustomer dtocuz=customerService.update( dtoCustomer);
        return ResponseEntity.ok(
                new APIResponse<>(200, "customer updated successfully", dtocuz)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteCustomer(@PathVariable String id) throws Exception {
         customerService.delete(id);
         return  ResponseEntity.ok(
                 new APIResponse<>(200,"customer deleted successfully",null)
         );
    }
}