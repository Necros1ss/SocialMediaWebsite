package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.dto.StoryDto;
import com.example.SocialMedia.model.coredata_model.Story;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.StoryRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.IMinioService;
import com.example.SocialMedia.service.social.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final IMinioService minioService;

    @Override
    public List<StoryDto> getActiveStories(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Integer> userIds = user.getFollowings().stream()
                .map(follow -> follow.getUserFollowing().getId())
                .collect(Collectors.toList());
        userIds.add(user.getId());

        List<Story> stories = storyRepository.findActiveStoriesByUserIds(userIds, new Date());
        
        return stories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public StoryDto createStory(String username, MultipartFile file, String mediaType) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var uploadResp = minioService.uploadFile(file);
        
        Story story = new Story();
        story.setUser(user);
        story.setMediaURL(uploadResp.getMediaUrl());
        story.setMediaType(mediaType != null ? mediaType : "IMAGE");
        
        Date now = new Date();
        story.setCreateAt(now);
        // Expiration after 24 hours
        Date expiresAt = new Date(now.getTime() + (1000 * 60 * 60 * 24));
        story.setExpiresAt(expiresAt);

        Story saved = storyRepository.save(story);
        return mapToDto(saved);
    }

    private StoryDto mapToDto(Story story) {
        User user = story.getUser();
        return new StoryDto(
                story.getStoryID(),
                user.getId(),
                user.getUsername(),
                user.getProfilePictureURL(),
                story.getMediaURL(),
                story.getMediaType(),
                story.getCreateAt(),
                story.getExpiresAt()
        );
    }
}
