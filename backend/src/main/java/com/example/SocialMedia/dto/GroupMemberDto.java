package com.example.SocialMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMemberDto {
    private int userId;
    private String username;
    private String avatar;
    private String role;
    private LocalDateTime joinedAt;
}
