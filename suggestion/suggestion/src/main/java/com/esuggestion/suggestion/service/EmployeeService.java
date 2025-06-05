package com.esuggestion.suggestion.service;

import com.esuggestion.suggestion.dto.EmployeeDTO;
import com.esuggestion.suggestion.jwt.JwtUtil;
import com.esuggestion.suggestion.mapper.EmployeeMapper;
import com.esuggestion.suggestion.model.Blacklist;
import com.esuggestion.suggestion.model.Employee;
import com.esuggestion.suggestion.model.Role;
import com.esuggestion.suggestion.repository.EmployeeRepository;
import com.esuggestion.suggestion.repository.TokenBlacklist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenBlacklist tokenBlacklist;
    @Autowired
    private OtpService otpService;

    public List<EmployeeDTO> readAllEmployees() {
        return employeeRepository.findAll()
            .stream()
            .map(EmployeeMapper::toDto)
            .collect(Collectors.toList());
    }

    public long getTotalEmployeeCount() {
        return employeeRepository.count();
    }

    public EmployeeDTO readEmployeeById(UUID id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Id not found"));
        return EmployeeMapper.toDto(employee);
    }

    public void createEmployee(EmployeeDTO employeeDTO) {
        Optional<Employee> empl = employeeRepository.findByEmail(employeeDTO.getEmail());

        if (empl.isPresent()) {
            throw new RuntimeException("Employe Already Exists");
        }
        Employee emp = new Employee();
        emp.setName(employeeDTO.getName());
        emp.setEmail(employeeDTO.getEmail());
        emp.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        emp.setRole(Role.USER);
        employeeRepository.save(emp);

        otpService.generateAndSendOtp(employeeDTO.getEmail(), "REGISTER");
    }

    public void validateRegister(String email, String otpCode){
        boolean valid = otpService.validateOtp(email, otpCode, "REGISTER");
        if (!valid) {
            throw new RuntimeException("Otp Exipired or Incorrect");
        }
        otpService.deleteOtp(email, "REGISTER");
    }

    public void loginEmployee(EmployeeDTO employeeDTO) {
        Optional<Employee> empl = employeeRepository.findByEmail(employeeDTO.getEmail());
        if (empl.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Employee employee = empl.get();
        if (!passwordEncoder.matches(employeeDTO.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Password Combination Dont match");
        }
        otpService.generateAndSendOtp(employee.getEmail(), "LOGIN");
        //return jwtUtil.generateToken(empl.get().getName(), empl.get().getRole());
    }

    public String validateLoginOtp(String email, String otpCode){
        boolean valid = otpService.validateOtp(email, otpCode, "LOGIN");
        if (!valid) {
            throw new RuntimeException("Otp Exipired or Incorrect");
        }
        otpService.deleteOtp(email, "LOGIN");
        Optional<Employee> optionalOtp = employeeRepository.findByEmail(email);
        if (optionalOtp.isEmpty()) {
            throw new RuntimeException("User NotFound");
        }
        Employee emp = optionalOtp.get();
        return jwtUtil.generateToken(emp.getName(), emp.getRole());
    }

    public void logout(String token) {
        Blacklist blacklist = new Blacklist(token, Instant.now());
        tokenBlacklist.save(blacklist);
    }    

    public void deleteEmployee(UUID id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
        }else{
            throw new RuntimeException("User not found");
        }
    }


    public EmployeeDTO changeEmployee( UUID id, EmployeeDTO employeeDTO){
        Optional<Employee> s = employeeRepository.findById(id);
        if (s.isPresent()) {
            Employee ss = s.get();
            ss.setName(employeeDTO.getName());
            ss.setEmail(employeeDTO.getEmail());
            Employee saved = employeeRepository.save(ss);
            return EmployeeMapper.toDto(saved);
        }else{
            throw new RuntimeException("User not found");
        }
    }
    public void resetPassword(EmployeeDTO employeeDTO){
        Optional<Employee> s = employeeRepository.findByEmail(employeeDTO.getEmail());
        if (s.isPresent()) {
            otpService.generateAndSendOtp(employeeDTO.getEmail(), "RESET");
        }else{
            throw new RuntimeException("Employee Not found");
        }
    }
    public void validatePasswordReset(EmployeeDTO employeeDTO){
        boolean valid = otpService.validateOtp(employeeDTO.getEmail(), employeeDTO.getOtp(), "RESET");
        if (!valid) {
            throw new RuntimeException("Failled to validate");
        }
        otpService.deleteOtp(employeeDTO.getEmail(), "RESET");
         
    }
    public EmployeeDTO updatePassword(EmployeeDTO employeeDTO){
        Optional<Employee> s = employeeRepository.findByEmail(employeeDTO.getEmail());
        if (s.isPresent()) {
            Employee ss = s.get();
            ss.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
            Employee emp = employeeRepository.save(ss);
            return EmployeeMapper.toDto(emp);
        }
        throw new RuntimeException("Employee Not found");
    }
    
}
