package com.esuggestion.suggestion.service;

import com.esuggestion.suggestion.dto.SuggestionDTO;
import com.esuggestion.suggestion.mapper.SuggestionMapper;
import com.esuggestion.suggestion.model.Employee;
import com.esuggestion.suggestion.model.Suggestion;
import com.esuggestion.suggestion.model.SuggestionType;
import com.esuggestion.suggestion.repository.EmployeeRepository;
import com.esuggestion.suggestion.repository.SuggestionRepository;
import com.esuggestion.suggestion.repository.SuggestionTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private SuggestionRepository suggestionRepository;
    @Autowired
    private SuggestionTypeRepository suggestionTypeRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    public List<SuggestionDTO> readAllSuggestions() {
        return suggestionRepository.findAll()
                .stream()
                .map(SuggestionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public long getTotalCount() {
        return suggestionRepository.count();
    }
    

    public long getTotalIdeasByEmployeeId(UUID employeeId) {
        return suggestionRepository.countByEmployeeId(employeeId);
    }

    public SuggestionDTO readSuggestionById(UUID id) {
        Suggestion sugge = suggestionRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("User Already Exists"));
        return SuggestionMapper.toDTO(sugge);
    }
    public Page<SuggestionDTO> getSuggestionByPage(Pageable pageable){
        return suggestionRepository.findAll(pageable)
            .map(SuggestionMapper::toDTO);
    }

    public Page<SuggestionDTO> getSuggestionByPageAndSort(String keyword, Pageable pageable){
        Page<Suggestion> pages;
        if (keyword != null && !keyword.trim().isEmpty()) {
            pages = suggestionRepository.findByTitleContainingIgnoreCase(keyword, pageable);
        }else{
            pages = suggestionRepository.findAll(pageable);
        }
        return pages.map(SuggestionMapper::toDTO);
    }

    public List<Suggestion> readSuggestionsByStatus(String status) {
        return suggestionRepository.findByStatus(status);
    }

    // public List<Suggestion> readSuggestionsByEmployeeId(UUID employeeId) {
    //     return suggestionRepository.findByEmployeeId(employeeId);
    // }

    public SuggestionDTO createSuggestion(SuggestionDTO suggestionDTO) {
        Suggestion suggestion = SuggestionMapper.toEntity(suggestionDTO);
        if (suggestionDTO.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(suggestionDTO.getEmployeeId())
                .orElseThrow(()-> new RuntimeException("Employee not Found"));
            suggestion.setEmployee(employee);
        }
        if (suggestionDTO.getSuggestionTypeId() != null) {
            SuggestionType suggestionType = suggestionTypeRepository.findById(suggestionDTO.getSuggestionTypeId())
                .orElseThrow(()-> new RuntimeException("SuggestionType not Found"));
            suggestion.setSuggestionType(suggestionType);
        }
        Suggestion saved = suggestionRepository.save(suggestion);
        return SuggestionMapper.toDTO(saved);
    }

    public void deleteSuggestion(UUID id) {
       if (suggestionRepository.existsById(id)) {
            suggestionRepository.deleteById(id);
       } else{
            throw new RuntimeException("Id not found");
       }
    }
    public SuggestionDTO changeSuggestion( UUID id, Suggestion suggestion){
        Optional<Suggestion> s = suggestionRepository.findById(id);
        if (s.isPresent()) {
            Suggestion ss = s.get();
            ss.setTitle(suggestion.getTitle());
            ss.setDescription(suggestion.getDescription());
            ss.setStatus(suggestion.getStatus());
            ss.setSuggestionType(suggestion.getSuggestionType());
            Suggestion suggestions = suggestionRepository.save(ss);
            return SuggestionMapper.toDTO(suggestions);
        }else{
            throw new RuntimeException("Id not found");
        }
    }
    
}
