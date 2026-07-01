package com.example.SocialMedia.repository;

import com.example.SocialMedia.model.coredata_model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
}
