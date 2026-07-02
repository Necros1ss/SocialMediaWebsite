package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.ReelDto;
import com.example.SocialMedia.service.social.ReelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reels")
@RequiredArgsConstructor
public class ReelController {

    private final ReelService reelService;

    @GetMapping
    public ResponseEntity<Page<ReelDto>> getReels(Pageable pageable) {
        return ResponseEntity.ok(reelService.getReels(pageable));
    }

    @PostMapping
    public ResponseEntity<ReelDto> createReel(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(reelService.createReel(username, file, caption));
    }
}
