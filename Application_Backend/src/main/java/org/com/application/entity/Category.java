package org.com.application.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @OneToMany(mappedBy = "category",cascade = CascadeType.ALL)
    private List<Product> products;

}

//    @Transactional
//    public List<DtoCategory> getAll() {
//        return categoryRepository.findAll()
//                .stream()
//                .map(cat -> new DtoCategory(cat.getId(), cat.getName()))
//                .collect(Collectors.toList());
//    }


