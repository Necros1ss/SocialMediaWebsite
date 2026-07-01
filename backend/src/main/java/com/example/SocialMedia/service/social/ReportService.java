package com.example.SocialMedia.service.social;

import com.example.SocialMedia.dto.ReportDto;
import java.util.List;

public interface ReportService {
    ReportDto createReport(String username, Integer reportedPostId, Integer reportedCommentId, Integer reportedUserId, String reason);
    List<ReportDto> getAllReports();
    ReportDto updateReportStatus(int reportId, String status);
}
