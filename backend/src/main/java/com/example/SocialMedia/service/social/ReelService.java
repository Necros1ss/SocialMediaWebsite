package com.example.SocialMedia.service.social;

import com.example.SocialMedia.dto.ReelDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ReelService {
    Page<ReelDto> getReels(Pageable pageable);
    ReelDto createReel(String username, MultipartFile file, String caption);
}
