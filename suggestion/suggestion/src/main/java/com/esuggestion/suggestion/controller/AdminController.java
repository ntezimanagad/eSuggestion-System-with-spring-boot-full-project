package com.esuggestion.suggestion.controller;

import com.esuggestion.suggestion.dto.AdminDTO;
import com.esuggestion.suggestion.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping(value = "/readAdmin")
    public ResponseEntity<List<AdminDTO>> readAdmin(){    
            return ResponseEntity.ok(adminService.readAllAdmins());   
    }
    @GetMapping(value = "/readAdminById/{id}")
    public ResponseEntity<?> readAdminById(@PathVariable UUID id){   
        return ResponseEntity.ok(adminService.readAdminById(id));    
    }

    @PostMapping(value = "/createAdmin", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAdmin(@RequestBody AdminDTO admin) {
        adminService.createAdmin(admin);
        return ResponseEntity.ok("created");
    }

    @DeleteMapping(value = "/removeAdminById/{id}")
    public ResponseEntity<?> removeAdminById(@PathVariable UUID id){
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("deleted");
    }
    @PutMapping(value = "/changeAdmin/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> changeAdmin(@PathVariable UUID id,@RequestBody AdminDTO admin){
        adminService.changeAdmin(id, admin);
        return ResponseEntity.ok("Updated");
    }
    
}
