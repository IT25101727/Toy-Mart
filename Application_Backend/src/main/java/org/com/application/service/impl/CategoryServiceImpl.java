package org.com.application.service.impl;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoCategory;
import org.com.application.dto.product.DtoProduct;
import org.com.application.entity.Category;
import org.com.application.exception.CustomException;
import org.com.application.repo.CategoryRepository;
import org.com.application.service.custom.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private  final ModelMapper modelMapper;

    @Override
    public DtoCategory save(DtoCategory dto) {
        if(categoryRepository.existsByName(dto.getName())){
            throw new CustomException("Category is already registered");
        }
        categoryRepository.save(modelMapper.map(dto, Category.class));
        return dto;
    }


    //remember to verify before update
    @Override
    public DtoCategory update(DtoCategory dto) {
        categoryRepository.save(modelMapper.map(dto,Category.class));
        return dto;
    }

    @Override
    @Transactional
    public List<DtoCategory> getAll() throws Exception {
        List<DtoCategory> categories=new ArrayList<>();
        return categoryRepository.findAll().stream().map(category -> {

            DtoCategory dtoCategory = new DtoCategory();
            dtoCategory.setId(category.getId());
            dtoCategory.setName(category.getName());

            List<DtoProduct> dtoProducts=category.getProducts().stream().map(product -> modelMapper.map(product,DtoProduct.class)).toList();
            dtoCategory.setProducts(dtoProducts);
            return dtoCategory;
        }).toList();
    }

    @Override
    public String getLastID() {
        return "";
    }

    @Override
    public void delete(String id) {
        categoryRepository.deleteById(Integer.parseInt(id));
    }

    @Override
    public DtoCategory find(String id) {
        return modelMapper.map(categoryRepository.findById(Integer.parseInt(id)),DtoCategory.class);
    }

    @Override
    public long getCount() {
        return categoryRepository.count();
    }
    @Override
    public boolean ifExit(String id) {
        return categoryRepository.existsById(Integer.parseInt(id));
    }
}
