package com.example.SocialMedia.keys;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowId implements Serializable {

    private int followerId;
    private int followingId;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FollowId followId = (FollowId) o;
        if (followerId != followId.followerId) return false;
        return followingId == followId.followingId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(followerId, followingId);
    }
}
