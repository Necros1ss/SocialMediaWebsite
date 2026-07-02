package com.example.SocialMedia.repository;

import com.example.SocialMedia.model.coredata_model.Reel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReelRepository extends JpaRepository<Reel, Integer> {
    Page<Reel> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
