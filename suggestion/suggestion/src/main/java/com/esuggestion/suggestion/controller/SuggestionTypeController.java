package com.esuggestion.suggestion.controller;

import com.esuggestion.suggestion.dto.SuggestionTypeDTO;
import com.esuggestion.suggestion.service.SuggestionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/suggestion-types")
@CrossOrigin("*")
public class SuggestionTypeController {

    @Autowired
    private SuggestionTypeService suggestionTypeService;

    @GetMapping(value = "/readSuggestionType")
    public ResponseEntity<List<SuggestionTypeDTO>> readSuggestionType(){
        return ResponseEntity.ok(suggestionTypeService.readAllTypes());   
    }
    @GetMapping(value = "/readByPage")
    public ResponseEntity<Page<SuggestionTypeDTO>> readByPage(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<SuggestionTypeDTO> page2 = suggestionTypeService.getByPage(pageable);
        return ResponseEntity.ok(page2);   
    }
    @GetMapping(value = "/readSuggestionTypeById/{id}")
    public ResponseEntity<?> readSuggestionTypeById(@PathVariable UUID id){   
        return ResponseEntity.ok(suggestionTypeService.readTypeById(id) );   
    }

    @PostMapping(value = "/createSuggestionType", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createSuggestionType(@RequestBody SuggestionTypeDTO type) {
        suggestionTypeService.createType(type);
        return ResponseEntity.ok("created");
    }

    @DeleteMapping(value = "/removeSuggestionTypeById/{id}")
    public ResponseEntity<?> removeSuggestionTypeById(@PathVariable UUID id){
        suggestionTypeService.deleteType(id);
        return ResponseEntity.ok("delete");
    }
    @PutMapping(value = "/changeSuggestionType/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> changeSuggestionType(@PathVariable UUID id,@RequestBody SuggestionTypeDTO type){
        suggestionTypeService.changeType(id, type);
        return ResponseEntity.ok("Updated");
    }
    
}
