package com.example.SocialMedia.dto.auth;

import com.example.SocialMedia.constant.AuthProvider;
import com.example.SocialMedia.constant.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ và tên phải từ 2 đến 50 ký tự")
    private String fullName;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Identifier không được để trống")
    private String identifier;

    @NotNull(message = "Channel không được để trống")
    private OtpChannel channel;

    private String email;
    private AuthProvider authProvider;

    @NotBlank(message = "Recaptcha token không được để trống")
    private String recaptchaToken;
}
