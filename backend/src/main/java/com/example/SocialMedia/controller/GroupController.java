package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.GroupDto;
import com.example.SocialMedia.dto.GroupMemberDto;
import com.example.SocialMedia.service.social.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupDto> createGroup(
            Authentication authentication,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "cover", required = false) MultipartFile cover
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(groupService.createGroup(username, name, description, cover));
    }

    @GetMapping
    public ResponseEntity<List<GroupDto>> getAllGroups(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(groupService.getAllGroups(username));
    }

    @GetMapping("/my")
    public ResponseEntity<List<GroupDto>> getMyGroups(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(groupService.getMyGroups(username));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GroupDto>> searchGroups(
            Authentication authentication,
            @RequestParam String query
    ) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(groupService.searchGroups(query, username));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDto> getGroupById(
            Authentication authentication,
            @PathVariable int groupId
    ) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(groupService.getGroupById(groupId, username));
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberDto>> getGroupMembers(@PathVariable int groupId) {
        return ResponseEntity.ok(groupService.getGroupMembers(groupId));
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<GroupDto> joinGroup(
            Authentication authentication,
            @PathVariable int groupId
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(groupService.joinGroup(groupId, username));
    }

    @PostMapping("/{groupId}/leave")
    public ResponseEntity<GroupDto> leaveGroup(
            Authentication authentication,
            @PathVariable int groupId
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(groupService.leaveGroup(groupId, username));
    }
}
