package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.dto.ReelDto;
import com.example.SocialMedia.model.coredata_model.Reel;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.ReelRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.IMinioService;
import com.example.SocialMedia.service.social.ReelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class ReelServiceImpl implements ReelService {

    private final ReelRepository reelRepository;
    private final UserRepository userRepository;
    private final IMinioService minioService;

    @Override
    public Page<ReelDto> getReels(Pageable pageable) {
        return reelRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToDto);
    }

    @Override
    public ReelDto createReel(String username, MultipartFile file, String caption) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var uploadResp = minioService.uploadFile(file);

        Reel reel = new Reel();
        reel.setUser(user);
        reel.setVideoURL(uploadResp.getMediaUrl());
        reel.setCaption(caption);
        reel.setCreatedAt(new Date());

        Reel saved = reelRepository.save(reel);
        return mapToDto(saved);
    }

    private ReelDto mapToDto(Reel reel) {
        User user = reel.getUser();
        return new ReelDto(
                reel.getReelID(),
                user.getId(),
                user.getUsername(),
                user.getProfilePictureURL(),
                reel.getVideoURL(),
                reel.getCaption(),
                reel.getCreatedAt()
        );
    }
}
