package org.com.application.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoProduct;
import org.com.application.entity.Product;
import org.com.application.exception.CustomException;
import org.com.application.repo.ProductRepository;
import org.com.application.service.custom.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public long count() {
        return productRepository.count();
    }

    @Override
    public DtoProduct save(DtoProduct dto) {
        if(productRepository.existsByName(dto.getName())){
            throw new CustomException("product is already registered");
        }
        productRepository.save(modelMapper.map(dto, Product.class));
        return dto;

    }

    @Override
    public DtoProduct update(DtoProduct dto) {
        productRepository.save(modelMapper.map(dto, Product.class));
        return dto;
    }

    @Override
    public List<DtoProduct> getAll() throws Exception {
        return productRepository.findAll().stream().map(product -> modelMapper.map(product,DtoProduct.class)).toList();
    }

    @Override
    public String getLastID() {
        int id=Integer.parseInt(productRepository.getLastID().get(0).substring(1));
        return String.format("P%03d",id);
    }

    @Override
    public void delete(String id) {
        productRepository.deleteById(id);

    }

    @Override
    public DtoProduct find(String id) {
        return modelMapper.map(productRepository.findById(id),DtoProduct.class);
    }
    @Override
    public boolean ifExit(String id) {
        return productRepository.existsById(id);
    }
}
