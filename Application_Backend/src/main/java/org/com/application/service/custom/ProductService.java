package org.com.application.service.custom;


import org.com.application.dto.product.DtoProduct;
import org.com.application.service.SuperService;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService extends SuperService<DtoProduct> {
    long count();

    DtoProduct  save(DtoProduct dto, MultipartFile img) throws Exception;
    DtoProduct  update(DtoProduct dto, MultipartFile img) throws Exception;

}
