package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.message.ConversationMemberDTO;
import com.example.SocialMedia.dto.message.WebSocketTokenResponse;
import com.example.SocialMedia.dto.request.MarkReadRequest;
import com.example.SocialMedia.dto.request.SendMessageRequest;
import com.example.SocialMedia.dto.response.ConversationResponse;
import com.example.SocialMedia.dto.response.MessageResponse;
import com.example.SocialMedia.dto.response.ReactionResponse;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.message.ChatService;
import com.example.SocialMedia.service.message.ConversationService;
import com.example.SocialMedia.service.message.MessageStatusService;
import com.example.SocialMedia.service.message.WebSocketSessionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.SocialMedia.dto.request.ReactionRequest;

import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final MessageStatusService messageStatusService;
    private final WebSocketSessionService webSocketSessionService;
    private final UserRepository userRepository;
    private final ConversationService conversationService;


    // 1. Endpoint Thả Reaction (Toggle: Add/Remove/Update)
    @PostMapping("/reactions")
    public ResponseEntity<?> reactToMessage(
            @RequestBody ReactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String action = chatService.reactToMessage(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "message", "Reaction updated successfully",
                "action", action,
                "targetId", request.getTargetId()
        ));
    }
    // 2. Endpoint Lấy danh sách chi tiết người thả tim (Lazy Loading)
    // Dùng khi user click vào icon reaction để xem "Ai đã thả tim?"
    @GetMapping("/messages/{messageId}/reactions")
    public ResponseEntity<?> getMessageReactionDetails(@PathVariable Long messageId) {
        List<ReactionResponse> details = conversationService.getReactionDetails(messageId);
        return ResponseEntity.ok(details);
    }
    // 1. Cập nhật ảnh đại diện nhóm (Conversation Avatar)
    @PutMapping(value = "/conversations/{conversationId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateConversationAvatar(
            @PathVariable int conversationId,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File ảnh không được để trống");
        }

        // Gọi Service
        String newAvatarUrl = conversationService.updateConversationAvatar(
                conversationId,
                file,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật ảnh nhóm thành công",
                "data", newAvatarUrl
        ));
    }
    // 2. Controller endpoint - Thêm vào ConversationController hoặc MessagingController
    @PutMapping("/{conversationId}/nickname")
    public ResponseEntity<?> updateNickname(
            @PathVariable Integer conversationId,
            @RequestBody ConversationMemberDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Lấy targetUserId từ request body - người muốn đổi nickname
        Integer targetUserId = request.getUserId();

        if (targetUserId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        conversationService.updateMemberNickname(
                conversationId,
                targetUserId,
                request.getNickname(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật biệt danh thành công",
                "data", request.getNickname()
        ));
    }
    // 3. Đổi tên nhóm (Conversation Name)
    @PutMapping("/{conversationId}/name")
    public ResponseEntity<?> updateConversationName(
            @PathVariable int conversationId,
            @RequestBody Map<String, String> payload, // Nhận JSON: {"conversationName": "Tên Nhóm Mới"}
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String newName = payload.get("conversationName");

        // Validate cơ bản
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên nhóm không được để trống");
        }

        // Gọi Service xử lý
        conversationService.updateConversationName(conversationId, newName, userDetails.getUsername());

        return ResponseEntity.ok(Map.of(
                "message", "Đổi tên nhóm thành công",
                "data", newName
        ));
    }

    // 1. Gửi tin nhắn (Text + File)
    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SendTo("/topic/chat.{conversationId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @RequestPart("data") String messageJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) throws JsonProcessingException {

        log.info("[ChatController] sendMessage called");
        log.info("[ChatController] userDetails: {}", (userDetails != null ? userDetails.getUsername() : "NULL"));
        log.info("[ChatController] messageJson: {}", messageJson);
        log.info("[ChatController] files: {}", (files != null ? files.size() : 0));
        if (files != null) {
            for (int i = 0; i < files.size(); i++) {
                MultipartFile f = files.get(i);
                log.info("[ChatController]   [{}] {} - {} bytes", i, f.getOriginalFilename(), f.getSize());
            }
        }

        SendMessageRequest request = new ObjectMapper().readValue(messageJson, SendMessageRequest.class);
        log.info("[ChatController] Request parsed: {}", request);

        assert userDetails != null;
        MessageResponse response = chatService.sendMessage(userDetails.getUsername(), request, files);
        return ResponseEntity.ok(response);
    }

    // 2. Đánh dấu đã đọc (Read Receipt)
    @PostMapping("/read")
    public ResponseEntity<Void> markAsRead(
            @RequestBody MarkReadRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        messageStatusService.markAsRead(userDetails.getUsername(), request);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/ws-token")
    public ResponseEntity<WebSocketTokenResponse> issueToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();

        String username = auth.getName();
        var user = userRepository.findByUserNameWithRoles(username).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        var token = webSocketSessionService.generateToken(user);
        return ResponseEntity.ok(token);
    }
    // ChatController.java
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> listConversations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = auth.getName();
        var data = chatService.getUserConversations(username, page, size);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponse>> listMessages(
            @PathVariable int conversationId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = auth.getName();
        var data = chatService.getMessages(username, conversationId, page, size);
        return ResponseEntity.ok(data);
    }
}