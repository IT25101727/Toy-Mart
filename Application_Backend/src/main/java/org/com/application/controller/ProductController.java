package org.com.application.controller;

import com.org.project.application.dto.DtoProduct;
import com.org.project.application.service.custom.ProductService;
import com.org.project.application.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseEntity<APIResponse<List<DtoProduct>>> getAllProducts() throws Exception {
        List<DtoProduct> products= productService.getAll();
        return ResponseEntity.ok(
                new APIResponse<>(200, "Products fetched successfully", products)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<DtoProduct>> getProductByID(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(new APIResponse<>(200,"Product found",productService.find(id)),HttpStatus.ACCEPTED);
    }


    @PostMapping
    public ResponseEntity<APIResponse<DtoProduct>> createProduct(@RequestBody DtoProduct dtoProduct) throws Exception {
         DtoProduct dtoProduct1=productService.save(dtoProduct);
         return new ResponseEntity<>(new APIResponse<>(201,"Product saved",dtoProduct1),HttpStatus.CREATED);
    }


    @PutMapping
    public ResponseEntity<APIResponse<DtoProduct>> updateProduct(@RequestBody DtoProduct dtoProduct) throws Exception {
        DtoProduct dtoProduct1=productService.update( dtoProduct);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Product updated successfully", dtoProduct1)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteProdcut(@PathVariable String id) throws Exception {
         productService.delete(id);
         return  ResponseEntity.ok(
                 new APIResponse<>(200,"Product deleted successfully",null)
         );
    }
}