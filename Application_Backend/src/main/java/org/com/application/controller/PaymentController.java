package org.com.application.controller;

import lombok.AllArgsConstructor;
import org.com.application.dto.DtoPayment;
import org.com.application.service.custom.PaymentService;
import org.com.application.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<APIResponse<List<DtoPayment>>> getAllPayments() throws Exception {
        return ResponseEntity.ok(new APIResponse<>(200,"Payments fetched successfully ",paymentService.getAll()));
    }
    @PostMapping
    public ResponseEntity<APIResponse<DtoPayment>> savePayment(@RequestBody DtoPayment dtoPayment) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"payment saved successfully",paymentService.save(dtoPayment)),HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<APIResponse<DtoPayment>> updatePayment(@RequestBody DtoPayment dtoPayment) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"payment Updated successfully",paymentService.update(dtoPayment)),HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<DtoPayment>> deletePayment(@PathVariable String id) throws Exception {
        paymentService.delete(id);
        return  ResponseEntity.ok(new APIResponse<>(200,"payment deleted successfully",null));
    }
}
