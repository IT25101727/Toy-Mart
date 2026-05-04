package org.com.application.service.custom;

import com.org.project.application.dto.DtoProduct;
import com.org.project.application.service.SuperService;

public interface ProductService extends SuperService<DtoProduct> {
    long count();
}
