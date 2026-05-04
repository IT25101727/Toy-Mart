package org.com.application.service.custom;


import org.com.application.dto.DtoCustomer;
import org.com.application.service.SuperSevice;

public interface CustomerService extends SuperSevice<DtoCustomer> {
    long getCount();
}
