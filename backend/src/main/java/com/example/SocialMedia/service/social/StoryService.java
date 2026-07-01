package com.example.SocialMedia.service.social;

import com.example.SocialMedia.dto.StoryDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface StoryService {
    List<StoryDto> getActiveStories(String username);
    StoryDto createStory(String username, MultipartFile file, String mediaType);
}
