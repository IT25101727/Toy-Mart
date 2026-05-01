package org.com.application.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DtoCategory {
    public int id;
    private String name;

    @JsonIgnore // 2. Add this annotation to break the infinite loop!
    @ToString.Exclude
    private List<DtoProduct> products;

}
