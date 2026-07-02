package com.example.SocialMedia.controller.social;

import com.example.SocialMedia.dto.UserProfileDto;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.service.social.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    private int getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User userDetails = (User) authentication.getPrincipal();
        return userDetails.getId();
    }

    @PostMapping("/request/{targetUserId}")
    public ResponseEntity<String> sendRequest(@PathVariable int targetUserId) {
        friendService.sendFriendRequest(getCurrentUserId(), targetUserId);
        return ResponseEntity.ok("Friend request sent successfully");
    }

    @PostMapping("/accept/{requesterId}")
    public ResponseEntity<String> acceptRequest(@PathVariable int requesterId) {
        friendService.acceptFriendRequest(getCurrentUserId(), requesterId);
        return ResponseEntity.ok("Friend request accepted");
    }

    @PostMapping("/decline/{requesterId}")
    public ResponseEntity<String> declineRequest(@PathVariable int requesterId) {
        friendService.declineFriendRequest(getCurrentUserId(), requesterId);
        return ResponseEntity.ok("Friend request declined");
    }

    @DeleteMapping("/unfriend/{friendId}")
    public ResponseEntity<String> unfriend(@PathVariable int friendId) {
        friendService.unfriend(getCurrentUserId(), friendId);
        return ResponseEntity.ok("Unfriended successfully");
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserProfileDto>> getFriends() {
        return ResponseEntity.ok(friendService.getFriends(getCurrentUserId()));
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<List<UserProfileDto>> getIncomingRequests() {
        return ResponseEntity.ok(friendService.getIncomingRequests(getCurrentUserId()));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserProfileDto>> getFriendSuggestions() {
        return ResponseEntity.ok(friendService.getFriendSuggestions(getCurrentUserId()));
    }
}
