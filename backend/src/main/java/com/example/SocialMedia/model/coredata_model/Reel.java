package com.example.SocialMedia.model.coredata_model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "Reels", schema = "CoreData")
@Setter
@Getter
public class Reel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReelID")
    private int reelID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Column(name = "VideoURL", nullable = false)
    private String videoURL;

    @Column(name = "Caption")
    private String caption;

    @Column(name = "CreatedAt", nullable = false)
    private Date createdAt;
}
