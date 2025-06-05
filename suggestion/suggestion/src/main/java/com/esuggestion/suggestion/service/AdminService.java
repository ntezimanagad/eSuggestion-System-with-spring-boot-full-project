package com.esuggestion.suggestion.service;

import com.esuggestion.suggestion.dto.AdminDTO;
import com.esuggestion.suggestion.mapper.AdminMapper;
import com.esuggestion.suggestion.model.Admin;
import com.esuggestion.suggestion.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;

    public List<AdminDTO> readAllAdmins() {
        return adminRepository.findAll()
            .stream()
            .map(AdminMapper::toDto)
            .collect(Collectors.toList());
    }

    public AdminDTO readAdminById(UUID id) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Id not dound"));
        return AdminMapper.toDto(admin);
    }

    public AdminDTO createAdmin(AdminDTO adminDTO) {
        Optional<Admin> adm = adminRepository.findByEmail(adminDTO.getEmail());
        if (adm.isPresent()) {
            throw new RuntimeException("Admin Already exists");
        }
        Admin admin = AdminMapper.toEntity(adminDTO);
        Admin saved = adminRepository.save(admin);
        return AdminMapper.toDto(saved);
    }

    public void deleteAdmin(UUID id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
        }else{
            throw new RuntimeException("Admin not found");
        }
    }

    public AdminDTO changeAdmin( UUID id, AdminDTO adminDTO){
        Optional<Admin> s = adminRepository.findById(id);
        if (s.isPresent()) {
            Admin ss = s.get();
            ss.setName(adminDTO.getName());
            ss.setEmail(adminDTO.getEmail());
            ss.setPassword(adminDTO.getPassword());
            Admin saved = adminRepository.save(ss);
            return AdminMapper.toDto(saved);
        }else{
            throw new RuntimeException("Admin not found");
        }
    }
    
    
}
