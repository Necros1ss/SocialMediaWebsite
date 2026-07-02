package com.example.SocialMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReelDto {
    private int reelId;
    private int userId;
    private String username;
    private String userAvatar;
    private String videoUrl;
    private String caption;
    private Date createdAt;
}
