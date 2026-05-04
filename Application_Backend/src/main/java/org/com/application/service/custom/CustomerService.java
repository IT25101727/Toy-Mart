package org.com.application.service.custom;


import org.com.application.dto.DtoCustomer;
import org.com.application.service.SuperService;

public interface CustomerService extends SuperService<DtoCustomer> {
    long getCount();
}
