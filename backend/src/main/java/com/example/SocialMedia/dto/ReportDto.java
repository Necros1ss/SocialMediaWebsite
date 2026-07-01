package com.example.SocialMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDto {
    private int reportId;
    private int reporterId;
    private String reporterName;
    private Integer reportedPostId;
    private Integer reportedCommentId;
    private Integer reportedUserId;
    private String reportedUserName;
    private String reason;
    private String reportStatus; // e.g. "PENDING", "RESOLVED"
    private LocalDateTime reportedAt;
}
