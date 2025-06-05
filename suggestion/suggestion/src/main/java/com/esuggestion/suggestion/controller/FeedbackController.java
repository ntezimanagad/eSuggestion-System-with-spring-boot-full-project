package com.esuggestion.suggestion.controller;

import com.esuggestion.suggestion.dto.FeedbackDTO;
import com.esuggestion.suggestion.dto.SuggestionTypeDTO;
import com.esuggestion.suggestion.model.Feedback;
import com.esuggestion.suggestion.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping(value = "/readFeedback")
    public ResponseEntity<List<FeedbackDTO>> readFeedback() {   
            return ResponseEntity.ok(feedbackService.readAllFeedback());  
    }

    @GetMapping(value = "/readByPage")
    public ResponseEntity<Page<FeedbackDTO>> readByPage(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<FeedbackDTO> page2 = feedbackService.readByPage(pageable);
        return ResponseEntity.ok(page2);   
    }

    @GetMapping("/readFeedbackById/{id}")
    public ResponseEntity<?> readFeedbackById(@PathVariable UUID id) {
        return ResponseEntity.ok(feedbackService.readFeedbackById(id));
    }

    @PostMapping(value = "/createFeedback", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        feedbackService.createFeedback(feedbackDTO);
        return ResponseEntity.ok("Feedback Created");
    }
    
    @DeleteMapping(value = "/deleteFeedback/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable UUID id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok("deleted");
    }
    @PutMapping(value = "/changeFeedback/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> changeFeedback(@PathVariable UUID id, @RequestBody Feedback feedback) {
        feedbackService.changeSuggestion(id, feedback);
        return ResponseEntity.ok("Updated");
    }    
}
