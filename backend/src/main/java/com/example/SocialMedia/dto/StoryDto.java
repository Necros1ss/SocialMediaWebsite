package com.example.SocialMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoryDto {
    private int id;
    private int userId;
    private String username;
    private String userAvatar;
    private String mediaUrl;
    private String mediaType;
    private Date createdAt;
    private Date expiresAt;
}
