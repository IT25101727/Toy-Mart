package org.com.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoProduct {
    private String id;
    private String name;
    private int qty;
    private double price;

    @ToString.Exclude
    private DtoCategory category;
}
