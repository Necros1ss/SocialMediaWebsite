package com.example.SocialMedia.controller;

import com.example.SocialMedia.service.social.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication, 
                                              @RequestParam(defaultValue = "0") int page, 
                                              @RequestParam(defaultValue = "20") int size) {
        String currentUsername = authentication.getName();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(currentUsername, PageRequest.of(page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        String currentUsername = authentication.getName();
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(currentUsername)));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(Authentication authentication, @PathVariable Long id) {
        String currentUsername = authentication.getName();
        notificationService.markAsRead(id, currentUsername);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }
}
