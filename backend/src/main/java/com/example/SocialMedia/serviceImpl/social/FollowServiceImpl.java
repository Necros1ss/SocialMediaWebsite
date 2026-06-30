package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.keys.FollowId;
import com.example.SocialMedia.model.coredata_model.Follow;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.FollowRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.FollowService;
import com.example.SocialMedia.service.social.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void followUser(String followerUsername, int followingUserId) {
        User follower = userRepository.findByUserName(followerUsername)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User following = userRepository.findById(followingUserId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (follower.getId() == followingUserId) {
            throw new RuntimeException("Cannot follow yourself");
        }

        FollowId followId = new FollowId(follower.getId(), followingUserId);
        if (!followRepository.existsById(followId)) {
            Follow follow = new Follow();
            follow.setFollowId(followId);
            follow.setUserFollower(follower);
            follow.setUserFollowing(following);
            follow.setFollowedLocalDateTime(LocalDateTime.now());
            followRepository.save(follow);
            
            notificationService.createNotification(following, follower, "NEW_FOLLOWER", (long) follower.getId());
        }
    }

    @Override
    @Transactional
    public void unfollowUser(String followerUsername, int followingUserId) {
        User follower = userRepository.findByUserName(followerUsername)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        
        FollowId followId = new FollowId(follower.getId(), followingUserId);
        if (followRepository.existsById(followId)) {
            followRepository.deleteById(followId);
        }
    }

    @Override
    public boolean isFollowing(String followerUsername, int followingUserId) {
        return userRepository.findByUserName(followerUsername)
                .map(follower -> followRepository.existsByFollowId_FollowerIdAndFollowId_FollowingId(follower.getId(), followingUserId))
                .orElse(false);
    }

    @Override
    public int getFollowersCount(int userId) {
        return followRepository.countByFollowId_FollowingId(userId);
    }

    @Override
    public int getFollowingCount(int userId) {
        return followRepository.countByFollowId_FollowerId(userId);
    }
}
