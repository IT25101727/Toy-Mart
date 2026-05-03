package org.com.application.service.custom;


import org.com.application.dto.DtoAdmin;
import org.com.application.service.SuperService;

public interface AdminService extends SuperService<DtoAdmin> {
    long getCount();

}
