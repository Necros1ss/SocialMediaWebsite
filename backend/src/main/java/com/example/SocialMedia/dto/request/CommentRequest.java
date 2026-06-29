package com.example.SocialMedia.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentRequest {
    private Integer id;
    private int userId;

    @NotNull(message = "ID mục tương tác không được để trống")
    private Integer targetInteractableItemID;

    private Integer parentCommentId;

    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;

    private LocalDateTime createdAt;
}
