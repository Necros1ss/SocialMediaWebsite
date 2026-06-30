package com.example.SocialMedia.service.social;

import com.example.SocialMedia.model.coredata_model.Notification;
import com.example.SocialMedia.model.coredata_model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createNotification(User recipient, User actor, String type, Long targetId);
    Page<Notification> getNotificationsForUser(String username, Pageable pageable);
    void markAsRead(Long notificationId, String username);
    long getUnreadCount(String username);
}
