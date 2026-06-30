package com.example.SocialMedia.controller;

import com.example.SocialMedia.service.social.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> followUser(Authentication authentication, @PathVariable int userId) {
        String currentUsername = authentication.getName();
        followService.followUser(currentUsername, userId);
        return ResponseEntity.ok(Map.of("message", "Successfully followed user"));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollowUser(Authentication authentication, @PathVariable int userId) {
        String currentUsername = authentication.getName();
        followService.unfollowUser(currentUsername, userId);
        return ResponseEntity.ok(Map.of("message", "Successfully unfollowed user"));
    }

    @GetMapping("/{userId}/status")
    public ResponseEntity<?> checkFollowStatus(Authentication authentication, @PathVariable int userId) {
        String currentUsername = authentication.getName();
        boolean isFollowing = followService.isFollowing(currentUsername, userId);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }
}
