package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.TypingPayload;
import com.example.SocialMedia.dto.response.SocketResponse;
import com.example.SocialMedia.dto.request.TypingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import java.security.Principal;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    // Client gửi socket tới: /app/chat.typing
    @MessageMapping("/chat.typing")
    public void processTypingStatus(@Payload TypingRequest request, Principal principal) {
        log.info("[TYPING DEBUG] Full Request: {}", request);
        log.info("[TYPING DEBUG] isTyping value: {}", request.isTyping());
        log.info("[TYPING DEBUG] conversationId: {}", request.getConversationId());

        var typingPayload = new TypingPayload(
                request.getConversationId(),
                principal.getName(),
                request.getUserId(),
                request.isTyping()
        );
        log.info("[TYPING DEBUG] TypingPayload created: {}", typingPayload);

        SocketResponse<Object> event = SocketResponse.builder()
                .type("TYPING")
                .payload(typingPayload)
                .build();

        messagingTemplate.convertAndSend("/topic/chat." + request.getConversationId(), event);
    }
}