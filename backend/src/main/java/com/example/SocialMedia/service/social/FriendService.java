package com.example.SocialMedia.service.social;

import com.example.SocialMedia.dto.UserProfileDto;

import java.util.List;

public interface FriendService {
    void sendFriendRequest(int requesterId, int addresseeId);
    void acceptFriendRequest(int addresseeId, int requesterId);
    void declineFriendRequest(int addresseeId, int requesterId);
    void unfriend(int userId1, int userId2);
    List<UserProfileDto> getFriends(int userId);
    List<UserProfileDto> getIncomingRequests(int userId);
    List<UserProfileDto> getFriendSuggestions(int userId);
}
