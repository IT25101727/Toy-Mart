package org.com.application.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.product.DtoProduct;
import org.com.application.service.custom.ProductService;
import org.com.application.util.APIResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<APIResponse<List<DtoProduct>>> getAllProducts() throws Exception {
        return ResponseEntity.ok(
                new APIResponse<>(200, "Products fetched successfully", productService.getAll())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<DtoProduct>> getProductByID(@PathVariable String id) throws Exception {
        return new ResponseEntity<>(
                new APIResponse<>(200, "Product found", productService.find(id)),
                HttpStatus.ACCEPTED
        );
    }
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<DtoProduct>> updateProduct(@RequestPart("product") String dtoProduct, @RequestPart(value = "img", required = false) MultipartFile img) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        DtoProduct product = mapper.readValue(dtoProduct, DtoProduct.class);

        DtoProduct updated = (img != null && !img.isEmpty()) ? productService.update(product, img) : productService.update(product);

        return ResponseEntity.ok(new APIResponse<>(200, "Product updated successfully", updated));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<String>> deleteProduct(@PathVariable String id) throws Exception {
        productService.delete(id);
        return ResponseEntity.ok(
                new APIResponse<>(200, "Product deleted successfully", null)
        );
    }

    //save
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<DtoProduct>> createProduct(@RequestPart("product") String dtoProduct,@RequestPart("img") MultipartFile img) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        DtoProduct product = mapper.readValue(dtoProduct, DtoProduct.class);

        DtoProduct saved = productService.save(product, img);

        return new ResponseEntity<>(
                new APIResponse<>(201, "Product saved", saved),
                HttpStatus.CREATED
        );
    }
}