package org.com.application.service.impl;

import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoCustomer;
import org.com.application.entity.Customer;
import org.com.application.exception.CustomException;
import org.com.application.repo.CustomerRepository;
import org.com.application.service.custom.CustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private  final ModelMapper modelMapper;


    @Override
    public DtoCustomer save(DtoCustomer dto) {
        if(dto.getCustomerId()==null){
            dto.setCustomerId(getLastID());
        }
        System.out.println(customerRepository.existsByEmail(dto.getEMail()));
        if(customerRepository.existsByEmail(dto.getEMail())){
            throw new CustomException("customer email is already registered");
        }
        customerRepository.save(modelMapper.map(dto, Customer.class));
        return dto;

    }

    //remember to verify before update
    @Override
    public DtoCustomer update(DtoCustomer dto) {
        if(customerRepository.existsByEmail(dto.getEMail()) & !find(dto.getCustomerId()).getCustomerId().equals(dto.getCustomerId())){
            throw new CustomException("customer email is already registered");
        }
        customerRepository.save(modelMapper.map(dto, Customer.class));
        return dto;
    }

    @Override
    public List<DtoCustomer> getAll() throws Exception {
        List<DtoCustomer> dtoCustomers =new ArrayList<>();
        customerRepository.findAll().forEach(customer -> {
            dtoCustomers.add(modelMapper.map(customer,DtoCustomer.class));
        });
        return dtoCustomers;
    }

    @Override
    public String getLastID() {
        int id=Integer.parseInt(customerRepository.getLastID().get(0).substring(1));
        return String.format("C%03d",++id);
    }

    @Override
    public void delete(String id) {
        customerRepository.deleteById(id);
    }

    @Override
    public DtoCustomer find(String id) {
        return modelMapper.map(customerRepository.findById(id),DtoCustomer.class);
    }

    @Override
    public long getCount() {
        return customerRepository.count();
    }
    @Override
    public boolean ifExit(String id) {
        return customerRepository.existsById(id);
    }

}


