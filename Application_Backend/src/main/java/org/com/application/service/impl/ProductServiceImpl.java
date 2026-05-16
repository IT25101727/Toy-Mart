package org.com.application.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.product.DtoImg;
import org.com.application.dto.product.DtoProduct;
import org.com.application.entity.product.Img;
import org.com.application.entity.product.Product;
import org.com.application.exception.CustomException;
import org.com.application.repo.ProductRepository;
import org.com.application.service.custom.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
        if (productRepository.existsByName(dto.getName())) {
            throw new CustomException("product is already registered");
        }
        productRepository.save(modelMapper.map(dto, Product.class));
        return dto;

    }

    @Override
    public DtoProduct update(DtoProduct dto) {
        Product existingProduct = productRepository.findById(dto.getId())
                .orElseThrow(() -> new CustomException("Product not found"));
        Product product = modelMapper.map(dto, Product.class);
        product.setImage(existingProduct.getImage());
        productRepository.save(modelMapper.map(dto, Product.class));
        return dto;
    }

    @Override
    public List<DtoProduct> getAll() throws Exception {
        return productRepository.findAll().stream().map(product -> modelMapper.map(product, DtoProduct.class)).toList();
    }

    @Override
    public String getLastID() {
        int id = Integer.parseInt(productRepository.getLastID().get(0).substring(1));
        return String.format("P%03d", id);
    }

    @Override
    public void delete(String id) {
        productRepository.deleteById(id);

    }

    @Override
    public DtoProduct find(String id) {
        return modelMapper.map(productRepository.findById(id), DtoProduct.class);
    }

    @Override
    public boolean ifExit(String id) {
        return productRepository.existsById(id);
    }

    @Override
    public DtoProduct save(DtoProduct dto, MultipartFile img) throws Exception {
        DtoImg image = new DtoImg();
        image.setImgName(img.getOriginalFilename());
        image.setImgType(img.getContentType());
        image.setImgData(img.getBytes());

        dto.setImage(image);

        Product product = modelMapper.map(dto, Product.class);

        productRepository.save(product);

        return modelMapper.map(product, DtoProduct.class);
    }

    @Override
    public DtoProduct update(DtoProduct dto, MultipartFile img) throws Exception {
        Product existingProduct = productRepository.findById(dto.getId()).orElseThrow(() -> new CustomException("Product not found"));

        Product product = modelMapper.map(dto, Product.class);

        if (img != null && !img.isEmpty()) {
            Img image = new Img();
            if (existingProduct.getImage() != null) {
                image.setId(existingProduct.getImage().getId());
            }
            image.setImgName(img.getOriginalFilename());
            image.setImgType(img.getContentType());
            image.setImgData(img.getBytes());
            product.setImage(image);
        }else {
            product.setImage(existingProduct.getImage());
        }
        productRepository.save(product);
        return modelMapper.map(product, DtoProduct.class);
    }
}
