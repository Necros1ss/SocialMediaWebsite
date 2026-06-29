package com.example.SocialMedia.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    @NotNull(message = "ID cuộc trò chuyện không được để trống")
    private Integer conversationId;

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    private String content;

    private Long replyToMessageId;
}