package com.example.SocialMedia.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
public class PostRequest {
    private Integer postId;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    @Size(max = 2000, message = "Nội dung bài viết không được quá 2000 ký tự")
    private String content;

    @JsonIgnore
    private MultipartFile[] medias;

    private int[] deleteMedia;

    @NotBlank(message = "Topic bài viết không được để trống")
    private String postTopic;

    private String location;

    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}