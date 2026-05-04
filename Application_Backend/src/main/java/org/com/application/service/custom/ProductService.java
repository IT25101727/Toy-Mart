package org.com.application.service.custom;


import org.com.application.dto.DtoProduct;
import org.com.application.service.SuperService;

public interface ProductService extends SuperService<DtoProduct> {
    long count();
}
