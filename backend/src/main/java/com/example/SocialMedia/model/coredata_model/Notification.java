package com.example.SocialMedia.model.coredata_model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications", schema = "CoreData")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NotificationID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RecipientUserID", nullable = false)
    private User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ActorUserID")
    private User actor;

    @Column(name = "NotificationType", nullable = false, length = 50)
    private String notificationType;

    @Column(name = "TargetItemID")
    private Long targetItemId;

    @Column(name = "IsRead", nullable = false)
    private boolean isRead = false;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
