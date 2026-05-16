package org.com.application.service.impl;


import lombok.RequiredArgsConstructor;
import org.com.application.config.PasswordHasher;
import org.com.application.dto.DtoAdmin;
import org.com.application.entity.Admin;
import org.com.application.exception.CustomException;
import org.com.application.repo.AdminRepository;
import org.com.application.service.custom.AdminService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {


    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;

    @Override
    public DtoAdmin save(DtoAdmin dtoAdmin) throws Exception{
        if (dtoAdmin.getAdminID() == null) {
            dtoAdmin.setAdminID(getLastID());
        }
        if(adminRepository.existsByUserName(dtoAdmin.getUserName())){
            throw new CustomException("user already exists");
        }
        dtoAdmin.setPassword(PasswordHasher.getHashPassword(dtoAdmin.getPassword()));
        adminRepository.save(modelMapper.map(dtoAdmin, Admin.class));
        return dtoAdmin;
    }

    @Override
    public DtoAdmin update(DtoAdmin dtoAdmin) {
        if(adminRepository.existsByUserName(dtoAdmin.getUserName())){
            throw new CustomException("user already exists");
        }
        dtoAdmin.setPassword(PasswordHasher.getHashPassword(dtoAdmin.getPassword()));
        adminRepository.save(modelMapper.map(dtoAdmin, Admin.class));
            return dtoAdmin;
    }

    @Override
    public List<DtoAdmin> getAll() throws Exception {
        List<DtoAdmin> dtoAdmins=new ArrayList<>();
        adminRepository.findAll().forEach(admin -> {
            dtoAdmins.add(modelMapper.map(admin, DtoAdmin.class));
        });
        return dtoAdmins;
    }


    @Override
    public void delete(String id) {
        adminRepository.deleteById(id);
    }

    @Override
    public DtoAdmin find(String id) {
        return modelMapper.map(adminRepository.findById(id),DtoAdmin.class);
    }

    @Override
    public String getLastID() {
        List<String> ids=adminRepository.getLastID();
        if (ids.get(0) == null) return "A001";
        int num = Integer.parseInt(ids.get(0) .substring(1));
        num++;
        return String.format("A%03d", num);
    }

    @Override
    public long getCount() {
        return  adminRepository.count();
    }

    @Override
    public boolean ifExit(String id) {
        return adminRepository.existsById(id);
    }

    @Override
    public boolean verifyLogin(DtoAdmin dtoAdmin) {
        Optional<Admin> admin = adminRepository.findAdminByUserName(dtoAdmin.getUserName());
        if (admin.isPresent()) {
            return PasswordHasher.checkPassword(dtoAdmin.getPassword(), admin.get().getPassword());
        }
        return false;
    }
}
