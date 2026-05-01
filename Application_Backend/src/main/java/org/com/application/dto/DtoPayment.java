package org.com.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoPayment {
    private String paymentID;
    private Date date;
    private DtoOrder order;
}
