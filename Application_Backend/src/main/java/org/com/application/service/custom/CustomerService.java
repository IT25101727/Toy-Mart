package com.org.project.application.service.custom;

import com.org.project.application.dto.DtoCustomer;
import com.org.project.application.service.SuperService;

public interface CustomerService extends SuperService<DtoCustomer> {
    long getCount();
}
