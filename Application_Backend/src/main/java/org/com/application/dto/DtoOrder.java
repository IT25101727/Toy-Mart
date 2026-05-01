package org.com.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class DtoOrder {
    private String orderID;
    private DtoCustomer customer;
    private List<DtoProduct> products;
}