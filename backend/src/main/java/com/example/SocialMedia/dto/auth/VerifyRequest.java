package com.example.SocialMedia.dto.auth;

import com.example.SocialMedia.constant.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerifyRequest {
    @NotBlank(message = "OTP không được để trống")
    private String otp;
    
    @NotBlank(message = "Identifier không được để trống")
    private String identifier;
    
    @NotNull(message = "Channel không được để trống")
    private OtpChannel channel;
}
