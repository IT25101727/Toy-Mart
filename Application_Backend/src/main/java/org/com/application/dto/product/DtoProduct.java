package org.com.application.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.com.application.dto.DtoCategory;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoProduct {
    private String id;
    private String name;
    private int qty;
    private double price;
    private DtoImg image;


    @ToString.Exclude
    private DtoCategory category;
}
