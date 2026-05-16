package org.com.application.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoImg {
    private Long id;
    private String imgName;
    private String imgType;
    private byte[] imgData;


}
