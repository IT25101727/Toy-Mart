package org.com.application.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoCustomer;
import org.com.application.dto.DtoOrder;
import org.com.application.dto.product.DtoProduct;
import org.com.application.entity.Order;
import org.com.application.exception.CustomException;
import org.com.application.repo.OrderRepository;
import org.com.application.service.custom.OrderService;
import org.com.application.service.custom.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;
    private final ProductService productService;

    @Override
    @Transactional
    public DtoOrder save(DtoOrder dto) throws Exception {
        List<DtoProduct> products=dto.getProducts();
        for (DtoProduct product : products) {
            DtoProduct dtoProduct=productService.find(product.getId());
            if(dtoProduct==null){
                throw new CustomException("product not found");
            }else {
                if(dtoProduct.getQty()==0){
                    throw new CustomException(dtoProduct.getName()+" qty is 0");
                }
                dtoProduct.setQty(dtoProduct.getQty()-1);
                productService.update(dtoProduct);
            }

        }
        orderRepository.save(modelMapper.map(dto, Order.class));
        return dto;
    }

    @Override
    public DtoOrder update(DtoOrder dto) {
        orderRepository.save(modelMapper.map(dto, Order.class));
        return dto;
    }

    @Override
    public List<DtoOrder> getAll() throws Exception {
        // Fetch all orders from DB
        List<Order> orders = orderRepository.findAll();

        // Map each order to a DtoOrder manually
        return orders.stream().map(order -> {
            DtoOrder dto = new DtoOrder();

            // Map basic order info
            dto.setOrderID(order.getOrderId());

            // Map customer using ModelMapper
            dto.setCustomer(modelMapper.map(order.getCustomer(), DtoCustomer.class));

            // Map products manually to DTO list
            List<DtoProduct> productDtos = order.getProducts()
                    .stream()
                    .map(product -> modelMapper.map(product, DtoProduct.class))
                    .toList();
            dto.setProducts(productDtos);

            return dto;
        }).toList();

    }

    @Override
    public String getLastID() {
        int id = Integer.parseInt(orderRepository.getLastID().get(0).substring(1));
        return String.format("O%03d", ++id);
    }

    @Override
    public void delete(String id) {
        orderRepository.deleteById(id);
    }

    @Override
    public DtoOrder find(String id) {
        return modelMapper.map(orderRepository.findById(id), DtoOrder.class);
    }

    @Override
    public boolean ifExit(String id) {
        return orderRepository.existsById(id);
    }
}
