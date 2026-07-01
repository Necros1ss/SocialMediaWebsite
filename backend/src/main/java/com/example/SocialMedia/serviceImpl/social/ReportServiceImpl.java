package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.dto.ReportDto;
import com.example.SocialMedia.model.coredata_model.Comment;
import com.example.SocialMedia.model.coredata_model.Post;
import com.example.SocialMedia.model.coredata_model.Report;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.CommentRepository;
import com.example.SocialMedia.repository.PostRepository;
import com.example.SocialMedia.repository.ReportRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Override
    public ReportDto createReport(String username, Integer reportedPostId, Integer reportedCommentId, Integer reportedUserId, String reason) {
        User reporter = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Report report = new Report();
        report.setReportUser(reporter);
        report.setReason(reason);
        report.setReportStatus("PENDING");
        report.setReportedLocalDateTime(LocalDateTime.now());

        if (reportedPostId != null) {
            Post post = postRepository.findById(reportedPostId).orElse(null);
            report.setPost(post);
        }
        if (reportedCommentId != null) {
            Comment comment = commentRepository.findById(reportedCommentId).orElse(null);
            report.setComment(comment);
        }
        if (reportedUserId != null) {
            User reportedUser = userRepository.findById(reportedUserId).orElse(null);
            report.setReportedUser(reportedUser);
        }

        Report saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    @Override
    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ReportDto updateReportStatus(int reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setReportStatus(status);
        return mapToDto(reportRepository.save(report));
    }

    private ReportDto mapToDto(Report report) {
        return new ReportDto(
                report.getReportId(),
                report.getReportUser().getId(),
                report.getReportUser().getUserName(),
                report.getPost() != null ? report.getPost().getPostId() : null,
                report.getComment() != null ? report.getComment().getCommentID() : null,
                report.getReportedUser() != null ? report.getReportedUser().getId() : null,
                report.getReportedUser() != null ? report.getReportedUser().getUserName() : null,
                report.getReason(),
                report.getReportStatus(),
                report.getReportedLocalDateTime()
        );
    }
}
