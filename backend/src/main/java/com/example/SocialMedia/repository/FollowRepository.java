package com.example.SocialMedia.repository;

import com.example.SocialMedia.keys.FollowId;
import com.example.SocialMedia.model.coredata_model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    boolean existsByFollowId_FollowerIdAndFollowId_FollowingId(int followerId, int followingId);
    
    int countByFollowId_FollowerId(int followerId);
    
    int countByFollowId_FollowingId(int followingId);
    
    void deleteByFollowId_FollowerIdAndFollowId_FollowingId(int followerId, int followingId);
    
    List<Follow> findByFollowId_FollowerId(int followerId);
}
