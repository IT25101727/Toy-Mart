package org.com.application.service.custom;


import org.com.application.dto.DtoCategory;
import org.com.application.service.SuperService;

public interface CategoryService extends SuperService<DtoCategory> {
    long getCount();
}
