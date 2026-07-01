package com.example.SocialMedia.dto.auth;

import com.example.SocialMedia.constant.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Identifier cannot be empty")
    private String identifier;

    @NotNull(message = "Channel cannot be empty")
    private OtpChannel channel;
    
    @NotBlank(message = "OTP cannot be empty")
    private String otp;
    
    @NotBlank(message = "New password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;
}
