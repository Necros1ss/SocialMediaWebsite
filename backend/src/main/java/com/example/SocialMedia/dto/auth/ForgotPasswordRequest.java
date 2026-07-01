package com.example.SocialMedia.dto.auth;

import com.example.SocialMedia.constant.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "Identifier cannot be empty")
    private String identifier;

    @NotNull(message = "Channel cannot be empty")
    private OtpChannel channel;
}
