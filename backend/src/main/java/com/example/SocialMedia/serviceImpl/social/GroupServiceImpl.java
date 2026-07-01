package com.example.SocialMedia.serviceImpl.social;

import com.example.SocialMedia.dto.GroupDto;
import com.example.SocialMedia.dto.GroupMemberDto;
import com.example.SocialMedia.model.coredata_model.Group;
import com.example.SocialMedia.model.coredata_model.GroupMember;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.GroupMemberRepository;
import com.example.SocialMedia.repository.GroupRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.IMinioService;
import com.example.SocialMedia.service.social.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final IMinioService minioService;

    @Override
    public GroupDto createGroup(String username, String name, String description, MultipartFile cover) {
        User creator = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setCreator(creator);
        group.setCreatedAt(LocalDateTime.now());

        if (cover != null && !cover.isEmpty()) {
            var uploadResp = minioService.uploadFile(cover);
            group.setCoverPictureURL(uploadResp.getMediaUrl());
        }

        Group savedGroup = groupRepository.save(group);

        // Add creator as ADMIN
        GroupMember admin = new GroupMember();
        admin.setGroup(savedGroup);
        admin.setUser(creator);
        admin.setRole("ADMIN");
        admin.setJoinedAt(LocalDateTime.now());
        groupMemberRepository.save(admin);

        return mapToDto(savedGroup, creator.getId());
    }

    @Override
    public GroupDto getGroupById(int groupId, String username) {
        User user = userRepository.findByUserName(username).orElse(null);
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        return mapToDto(group, user != null ? user.getId() : -1);
    }

    @Override
    public List<GroupDto> getAllGroups(String username) {
        User user = userRepository.findByUserName(username).orElse(null);
        int userId = user != null ? user.getId() : -1;
        return groupRepository.findAll().stream()
                .map(g -> mapToDto(g, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<GroupDto> searchGroups(String query, String username) {
        User user = userRepository.findByUserName(username).orElse(null);
        int userId = user != null ? user.getId() : -1;
        return groupRepository.searchGroups(query).stream()
                .map(g -> mapToDto(g, userId))
                .collect(Collectors.toList());
    }

    @Override
    public GroupDto joinGroup(int groupId, String username) {
        User user = userRepository.findByUserName(username).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        
        Optional<GroupMember> existing = groupMemberRepository.findByGroupGroupIdAndUser_Id(groupId, user.getId());
        if (existing.isEmpty()) {
            GroupMember member = new GroupMember();
            member.setGroup(group);
            member.setUser(user);
            member.setRole("MEMBER");
            member.setJoinedAt(LocalDateTime.now());
            groupMemberRepository.save(member);
        }
        
        return mapToDto(group, user.getId());
    }

    @Override
    public GroupDto leaveGroup(int groupId, String username) {
        User user = userRepository.findByUserName(username).orElseThrow();
        Group group = groupRepository.findById(groupId).orElseThrow();
        
        Optional<GroupMember> existing = groupMemberRepository.findByGroupGroupIdAndUser_Id(groupId, user.getId());
        existing.ifPresent(groupMemberRepository::delete);
        
        return mapToDto(group, user.getId());
    }

    @Override
    public List<GroupMemberDto> getGroupMembers(int groupId) {
        return groupMemberRepository.findByGroupGroupId(groupId).stream()
                .map(gm -> new GroupMemberDto(
                        gm.getUser().getId(),
                        gm.getUser().getUserName(),
                        gm.getUser().getProfilePictureURL(),
                        gm.getRole(),
                        gm.getJoinedAt()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<GroupDto> getMyGroups(String username) {
        User user = userRepository.findByUserName(username).orElseThrow();
        return groupMemberRepository.findByUser_Id(user.getId()).stream()
                .map(gm -> mapToDto(gm.getGroup(), user.getId()))
                .collect(Collectors.toList());
    }

    private GroupDto mapToDto(Group group, int currentUserId) {
        List<GroupMember> members = groupMemberRepository.findByGroupGroupId(group.getGroupId());
        
        boolean isMember = false;
        String role = null;
        for (GroupMember gm : members) {
            if (gm.getUser().getId() == currentUserId) {
                isMember = true;
                role = gm.getRole();
                break;
            }
        }
        
        return new GroupDto(
                group.getGroupId(),
                group.getName(),
                group.getDescription(),
                group.getCoverPictureURL(),
                group.getCreator().getId(),
                group.getCreator().getUserName(),
                group.getCreatedAt(),
                members.size(),
                isMember,
                role
        );
    }
}
