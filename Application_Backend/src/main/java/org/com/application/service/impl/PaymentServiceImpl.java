package org.com.application.service.impl;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.com.application.dto.DtoPayment;
import org.com.application.entity.Order;
import org.com.application.entity.Payment;
import org.com.application.exception.CustomException;
import org.com.application.repo.PaymentRepository;
import org.com.application.service.custom.PaymentService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    @Override
    public DtoPayment save(DtoPayment dto) {
        if(paymentRepository.existsByOrder(modelMapper.map(dto.getOrder(), Order.class))){
            throw new CustomException("order payment is already done");
        }
        paymentRepository.save(modelMapper.map(dto, Payment.class));
        return dto;
    }

    @Override
    public DtoPayment update(DtoPayment dto) {
        if(paymentRepository.existsByOrder(modelMapper.map(dto.getOrder(), Order.class))){
            throw new CustomException("order payment is already recoded");
        }
        paymentRepository.save(modelMapper.map(dto, Payment.class));
        return  dto;
    }

    @Override
    public List<DtoPayment> getAll() throws Exception {
        return paymentRepository.findAll().stream().map(payment -> modelMapper.map(payment, DtoPayment.class)).toList();
    }

    @Override
    public String getLastID() {
        int id=Integer.parseInt(paymentRepository.getLastID().get(0).substring(1));
        return String.format("P%03d",++id);
    }

    @Override
    public void delete(String id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public DtoPayment find(String id) {
        return modelMapper.map(paymentRepository.findById(id),DtoPayment.class);
    }
    @Override
    public boolean ifExit(String id) {
        return paymentRepository.existsById(id);
    }
}
