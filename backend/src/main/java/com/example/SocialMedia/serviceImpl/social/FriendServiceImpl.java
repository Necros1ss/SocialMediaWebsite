package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.dto.UserProfileDto;
import com.example.SocialMedia.exception.BusinessException;
import com.example.SocialMedia.model.coredata_model.Friendship;
import com.example.SocialMedia.model.coredata_model.FriendshipStatus;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.FriendshipRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    @Override
    public void sendFriendRequest(int requesterId, int addresseeId) {
        if (requesterId == addresseeId) {
            throw new BusinessException("Cannot send friend request to yourself");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new BusinessException("Requester not found"));
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new BusinessException("Addressee not found"));

        Optional<Friendship> existing = friendshipRepository.findByUsers(requester, addressee);
        if (existing.isPresent()) {
            Friendship f = existing.get();
            if (f.getStatus() == FriendshipStatus.ACCEPTED) {
                throw new BusinessException("Already friends");
            } else if (f.getStatus() == FriendshipStatus.PENDING) {
                throw new BusinessException("Friend request already exists");
            }
        }

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(LocalDateTime.now());
        friendship.setUpdatedAt(LocalDateTime.now());
        friendshipRepository.save(friendship);
    }

    @Override
    public void acceptFriendRequest(int addresseeId, int requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new BusinessException("Requester not found"));
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new BusinessException("Addressee not found"));

        Optional<Friendship> existing = friendshipRepository.findByUsers(requester, addressee);
        if (existing.isEmpty() || existing.get().getStatus() != FriendshipStatus.PENDING) {
            throw new BusinessException("No pending friend request found");
        }

        Friendship f = existing.get();
        if (f.getAddressee().getId() != addresseeId) {
            throw new BusinessException("You are not the addressee of this request");
        }

        f.setStatus(FriendshipStatus.ACCEPTED);
        f.setUpdatedAt(LocalDateTime.now());
        friendshipRepository.save(f);
    }

    @Override
    public void declineFriendRequest(int addresseeId, int requesterId) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new BusinessException("Requester not found"));
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new BusinessException("Addressee not found"));

        Optional<Friendship> existing = friendshipRepository.findByUsers(requester, addressee);
        if (existing.isPresent() && existing.get().getStatus() == FriendshipStatus.PENDING) {
            if (existing.get().getAddressee().getId() != addresseeId) {
                throw new BusinessException("You are not the addressee of this request");
            }
            friendshipRepository.delete(existing.get());
        }
    }

    @Override
    public void unfriend(int userId1, int userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new BusinessException("User not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new BusinessException("User not found"));

        Optional<Friendship> existing = friendshipRepository.findByUsers(user1, user2);
        if (existing.isPresent() && existing.get().getStatus() == FriendshipStatus.ACCEPTED) {
            friendshipRepository.delete(existing.get());
        }
    }

    @Override
    public List<UserProfileDto> getFriends(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByUserAndStatus(user, FriendshipStatus.ACCEPTED);
        return friendships.stream()
                .map(f -> f.getRequester().getId() == userId ? f.getAddressee().toUserProfileDto() : f.getRequester().toUserProfileDto())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserProfileDto> getIncomingRequests(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));

        List<Friendship> incoming = friendshipRepository.findByAddresseeAndStatus(user, FriendshipStatus.PENDING);
        return incoming.stream()
                .map(f -> f.getRequester().toUserProfileDto())
                .collect(Collectors.toList());
    }

    @Override
    public List<UserProfileDto> getFriendSuggestions(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));
                
        // For simplicity, returning random users who are not already friends/pending.
        // In a real scenario, this would use mutual friends logic or Graph queries.
        List<User> allUsers = userRepository.findAll();
        List<Friendship> userFriendships = friendshipRepository.findByUserAndStatus(user, FriendshipStatus.ACCEPTED);
        List<Friendship> userPending = friendshipRepository.findByUserAndStatus(user, FriendshipStatus.PENDING);
        
        List<Integer> excludedIds = userFriendships.stream()
                .map(f -> f.getRequester().getId() == userId ? f.getAddressee().getId() : f.getRequester().getId())
                .collect(Collectors.toList());
        excludedIds.addAll(userPending.stream()
                .map(f -> f.getRequester().getId() == userId ? f.getAddressee().getId() : f.getRequester().getId())
                .collect(Collectors.toList()));
        excludedIds.add(userId);

        return allUsers.stream()
                .filter(u -> !excludedIds.contains(u.getId()))
                .limit(10)
                .map(User::toUserProfileDto)
                .collect(Collectors.toList());
    }
}
