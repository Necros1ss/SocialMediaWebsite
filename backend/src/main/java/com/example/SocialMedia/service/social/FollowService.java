package com.example.SocialMedia.service.social;

public interface FollowService {
    void followUser(String followerUsername, int followingUserId);
    void unfollowUser(String followerUsername, int followingUserId);
    boolean isFollowing(String followerUsername, int followingUserId);
    int getFollowersCount(int userId);
    int getFollowingCount(int userId);
}
