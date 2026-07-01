package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.StoryDto;
import com.example.SocialMedia.service.social.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public ResponseEntity<List<StoryDto>> getActiveStories(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(storyService.getActiveStories(username));
    }

    @PostMapping
    public ResponseEntity<StoryDto> createStory(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "mediaType", required = false, defaultValue = "IMAGE") String mediaType
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(storyService.createStory(username, file, mediaType));
    }
}
