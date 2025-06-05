package com.esuggestion.suggestion.service;

import com.esuggestion.suggestion.dto.SuggestionTypeDTO;
import com.esuggestion.suggestion.mapper.SuggestionTypeMapper;
import com.esuggestion.suggestion.model.SuggestionType;
import com.esuggestion.suggestion.repository.SuggestionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuggestionTypeService {

    @Autowired
    private SuggestionTypeRepository suggestionTypeRepository;

    public List<SuggestionTypeDTO> readAllTypes() {
        return suggestionTypeRepository.findAll()
                .stream()
                .map(SuggestionTypeMapper::toDto)
                .collect(Collectors.toList());
    }

    public Page<SuggestionTypeDTO> getByPage(Pageable pageable){
        return suggestionTypeRepository.findAll(pageable)
            .map(SuggestionTypeMapper::toDto);
    }

    public SuggestionTypeDTO readTypeById(UUID id) {
        SuggestionType suggestionType = suggestionTypeRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("type not found"));
        return SuggestionTypeMapper.toDto(suggestionType);
    }

    public SuggestionTypeDTO createType(SuggestionTypeDTO type) {
        Optional<SuggestionType> typ = suggestionTypeRepository.findByName(type.getName());
        if (typ.isPresent()) {
            throw new RuntimeException();
        }
        SuggestionType suggestionType = SuggestionTypeMapper.toEntity(type);
        SuggestionType saved = suggestionTypeRepository.save(suggestionType);
        return SuggestionTypeMapper.toDto(saved);   
    }

    public void deleteType(UUID id) {
        if (suggestionTypeRepository.existsById(id)) {
            suggestionTypeRepository.deleteById(id);
        }else{
            throw new RuntimeException("id not found");
        }
    }
    public SuggestionTypeDTO changeType( UUID id, SuggestionTypeDTO type){
        Optional<SuggestionType> s = suggestionTypeRepository.findById(id);
        if (s.isPresent()) {
            SuggestionType ss = s.get();
            ss.setName(type.getName());
            SuggestionType suggestionType = suggestionTypeRepository.save(ss);
            return SuggestionTypeMapper.toDto(suggestionType);
        }else{
            throw new RuntimeException("id not found");
        }
    }   
}
