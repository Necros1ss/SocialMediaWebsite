package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.model.coredata_model.Notification;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.NotificationRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void createNotification(User recipient, User actor, String type, Long targetId) {
        if (recipient.getId() == actor.getId()) {
            return; // Don't notify yourself
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setNotificationType(type);
        notification.setTargetItemId(targetId);
        notification = notificationRepository.save(notification);
        
        // Push WebSocket notification
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", notification.getId());
        payload.put("type", type);
        payload.put("actorName", actor.getFullName() != null ? actor.getFullName() : actor.getUsername());
        payload.put("actorAvatar", actor.getProfilePictureURL());
        payload.put("targetId", targetId);
        payload.put("isRead", false);
        
        messagingTemplate.convertAndSendToUser(
            recipient.getUsername(),
            "/queue/notifications",
            payload
        );
    }

    @Override
    public Page<Notification> getNotificationsForUser(String username, Pageable pageable) {
        return userRepository.findByUserName(username)
                .map(user -> notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(user.getId(), pageable))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getRecipient().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public long getUnreadCount(String username) {
        return userRepository.findByUserName(username)
                .map(user -> notificationRepository.countByRecipient_IdAndIsReadFalse(user.getId()))
                .orElse(0L);
    }
}
