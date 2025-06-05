package com.esuggestion.suggestion.service;

import com.esuggestion.suggestion.dto.FeedbackDTO;
import com.esuggestion.suggestion.mapper.FeedbackMapper;
import com.esuggestion.suggestion.model.Admin;
import com.esuggestion.suggestion.model.Feedback;
import com.esuggestion.suggestion.model.Suggestion;
import com.esuggestion.suggestion.repository.AdminRepository;
import com.esuggestion.suggestion.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private com.esuggestion.suggestion.repository.SuggestionRepository suggestionRepository;
    @Autowired
    private AdminRepository adminRepository;

    public List<FeedbackDTO> readAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(FeedbackMapper::toDto)
                .collect(Collectors.toList());
    }

    public Page<FeedbackDTO> readByPage(Pageable pageable){
        return feedbackRepository.findAll(pageable)
            .map(FeedbackMapper::toDto);
    }

    public FeedbackDTO readFeedbackById(UUID id) {
        Feedback feedback = feedbackRepository.findById(id)
            .orElseThrow(()->new RuntimeException("Id not found"));
        return FeedbackMapper.toDto(feedback);
    }


public FeedbackDTO createFeedback(FeedbackDTO feedbackDTO) {
    Feedback feedback = FeedbackMapper.toEntity(feedbackDTO);
    if (feedbackDTO.getSuggestionId() != null) {
        Suggestion suggestion = suggestionRepository.findById(feedbackDTO.getSuggestionId())
            .orElseThrow(()-> new RuntimeException("Suggestion not found"));
        feedback.setSuggestion(suggestion);
    }
    if (feedbackDTO.getAdminid() != null) {
        Admin admin = adminRepository.findById(feedbackDTO.getAdminid())
            .orElseThrow(()-> new RuntimeException("Admin not found"));
        feedback.setAdmin(admin);
    }
    Optional<Suggestion> sug = suggestionRepository.findById(feedbackDTO.getSuggestionId());
    if (sug.isPresent()) {
        Suggestion ss = sug.get();
        ss.setStatus(feedbackDTO.getDecision());
        ss.setComments(feedbackDTO.getComments());
        suggestionRepository.save(ss);
    }
    Feedback saved = feedbackRepository.save(feedback);
    return FeedbackMapper.toDto(saved);
}


    public void deleteFeedback(UUID id) {
        if (feedbackRepository.existsById(id)) {
            feedbackRepository.deleteById(id);
        }else{
            throw new RuntimeException("feedback not found");
        }
    }

    public FeedbackDTO changeSuggestion( UUID id, Feedback feedback){
        Optional<Feedback> s = feedbackRepository.findById(id);
        if (s.isPresent()) {
            Feedback ss = s.get();
            ss.setComments(feedback.getComments());
            ss.setDecision(feedback.getDecision());
            ss.setAdmin(feedback.getAdmin());
            ss.setSuggestion(feedback.getSuggestion());
            Feedback saved = feedbackRepository.save(ss);
            Optional<Suggestion> sug = suggestionRepository.findById(feedback.getSuggestion().getId());
            if (sug.isPresent()) {
                Suggestion sss = sug.get();
                sss.setStatus(feedback.getDecision());
                sss.setComments(feedback.getComments());
                suggestionRepository.save(sss);
            }
            return FeedbackMapper.toDto(saved);
        }else{
            throw new RuntimeException("feedback not found");
        }
    }
    
    
}
