package org.com.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoCustomer {
    private String customerId;
    private String name;
    private  String eMail;
    private String passWord;

}
