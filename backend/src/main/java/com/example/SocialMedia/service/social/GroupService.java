package com.example.SocialMedia.service.social;

import com.example.SocialMedia.dto.GroupDto;
import com.example.SocialMedia.dto.GroupMemberDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface GroupService {
    GroupDto createGroup(String username, String name, String description, MultipartFile cover);
    GroupDto getGroupById(int groupId, String username);
    List<GroupDto> getAllGroups(String username);
    List<GroupDto> searchGroups(String query, String username);
    GroupDto joinGroup(int groupId, String username);
    GroupDto leaveGroup(int groupId, String username);
    List<GroupMemberDto> getGroupMembers(int groupId);
    List<GroupDto> getMyGroups(String username);
}
