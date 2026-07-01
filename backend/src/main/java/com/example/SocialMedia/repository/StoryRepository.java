package com.example.SocialMedia.repository;

import com.example.SocialMedia.model.coredata_model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Integer> {

    @Query("SELECT s FROM Story s WHERE s.user.id IN :userIds AND s.ExpiresAt > :now ORDER BY s.CreateAt DESC")
    List<Story> findActiveStoriesByUserIds(@Param("userIds") List<Integer> userIds, @Param("now") Date now);
}
