package com.org.project.application.service.impl;

import com.org.project.application.dto.DtoPayment;
import com.org.project.application.entity.Order;
import com.org.project.application.entity.Payment;
import com.org.project.application.exception.CustomException;
import com.org.project.application.repo.OrderRepository;
import com.org.project.application.repo.PaymentRepository;
import com.org.project.application.service.custom.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
