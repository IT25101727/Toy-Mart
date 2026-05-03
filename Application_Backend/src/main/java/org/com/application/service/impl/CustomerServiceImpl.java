package com.org.project.application.service.impl;

import com.org.project.application.dto.DtoCustomer;
import com.org.project.application.entity.Customer;
import com.org.project.application.exception.CustomException;
import com.org.project.application.repo.CustomerRepository;
import com.org.project.application.service.custom.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
        if(customerRepository.existsByEmail(dto.getEMail())){
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


