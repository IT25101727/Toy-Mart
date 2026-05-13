package org.com.application.controller;

import lombok.AllArgsConstructor;
import org.com.application.dto.DtoOrder;
import org.com.application.service.custom.OrderService;
import org.com.application.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/order")
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<APIResponse<List<DtoOrder>>> getAllOrders() throws Exception {
        return ResponseEntity.ok(new APIResponse<>(200,"orders fetched successfully",orderService.getAll()));
    }

    @PostMapping
    public ResponseEntity<APIResponse<DtoOrder>> saveOrder(@RequestBody DtoOrder dtoOrder) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"order saved successfully",orderService.save(dtoOrder)), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<APIResponse<DtoOrder>> updateOrder(@RequestBody DtoOrder dtoOrder) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"order updated successfully",orderService.update(dtoOrder)), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<APIResponse<String>> deleteOrder(@PathVariable String id) throws Exception {
        orderService.delete(id);
        return ResponseEntity.ok(new APIResponse<>(200,"order successfully deleted",null));
    }


}
