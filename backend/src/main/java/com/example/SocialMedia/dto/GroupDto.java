package com.example.SocialMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupDto {
    private int groupId;
    private String name;
    private String description;
    private String coverPictureURL;
    private int creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
    private int memberCount;
    private boolean isMember;
    private String userRole; // "ADMIN", "MEMBER", or null
}
