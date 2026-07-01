package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.UserProfileDto;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.IMinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final IMinioService minioService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return ResponseEntity.ok(user.toUserProfileDto());
    }

    @GetMapping("/friends")
    public ResponseEntity<List<UserProfileDto>> getFriends(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userDetails.getUsername()));
        
        List<UserProfileDto> friends = user.getFollowings().stream()
                .map(follow -> follow.getUserFollowing().toUserProfileDto())
                .collect(Collectors.toList());
        
        // Fallback to show other users if no followings exist so the sidebar isn't empty
        if (friends.isEmpty()) {
            friends = userRepository.findAll().stream()
                    .filter(u -> u.getId() != user.getId())
                    .limit(5)
                    .map(User::toUserProfileDto)
                    .collect(Collectors.toList());
        }
        
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<UserProfileDto>> getRecommendations(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userDetails.getUsername()));

        List<Integer> followingIds = user.getFollowings().stream()
                .map(follow -> follow.getUserFollowing().getId())
                .collect(Collectors.toList());

        List<UserProfileDto> recommendations = userRepository.findAll().stream()
                .filter(u -> u.getId() != user.getId() && !followingIds.contains(u.getId()))
                .limit(5) // Suggest 5 people
                .map(User::toUserProfileDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(recommendations);
    }

    @PostMapping(value = "/profile/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDto> updateProfile(
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "cover", required = false) MultipartFile cover,
            @RequestParam(value = "profileVisibility", required = false) Boolean profileVisibility,
            @RequestParam(value = "activityStatus", required = false) Boolean activityStatus,
            @RequestParam(value = "dataSharing", required = false) Boolean dataSharing,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "timezone", required = false) String timezone,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByUserName(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userDetails.getUsername()));

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        if (email != null && !email.isBlank()) {
            user.setEmail(email);
        }
        if (phone != null && !phone.isBlank()) {
            user.setPhoneNumber(phone);
        }
        if (profileVisibility != null) {
            user.setProfileVisibility(profileVisibility);
        }
        if (activityStatus != null) {
            user.setActivityStatus(activityStatus);
        }
        if (dataSharing != null) {
            user.setDataSharing(dataSharing);
        }
        if (language != null && !language.isBlank()) {
            user.setLanguage(language);
        }
        if (timezone != null && !timezone.isBlank()) {
            user.setTimezone(timezone);
        }
        if (avatar != null && !avatar.isEmpty()) {
            var uploadResp = minioService.uploadFile(avatar);
            user.setProfilePictureURL(uploadResp.getMediaUrl());
        }
        if (cover != null && !cover.isEmpty()) {
            var uploadResp = minioService.uploadFile(cover);
            user.setCoverPictureURL(uploadResp.getMediaUrl());
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser.toUserProfileDto());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserProfileDto>> searchUsers(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        List<UserProfileDto> results = userRepository.searchUsers(q).stream()
                .map(User::toUserProfileDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
}
