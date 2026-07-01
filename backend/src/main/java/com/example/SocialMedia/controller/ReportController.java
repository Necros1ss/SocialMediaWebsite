package com.example.SocialMedia.controller;

import com.example.SocialMedia.dto.ReportDto;
import com.example.SocialMedia.service.social.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportDto> createReport(
            Authentication authentication,
            @RequestParam(required = false) Integer postId,
            @RequestParam(required = false) Integer commentId,
            @RequestParam(required = false) Integer userId,
            @RequestParam String reason
    ) {
        String username = authentication.getName();
        return ResponseEntity.ok(reportService.createReport(username, postId, commentId, userId, reason));
    }

    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<ReportDto> updateStatus(
            @PathVariable int reportId,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(reportService.updateReportStatus(reportId, status));
    }
}
