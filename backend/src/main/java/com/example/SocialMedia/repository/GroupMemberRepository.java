package com.example.SocialMedia.repository;

import com.example.SocialMedia.model.coredata_model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Integer> {
    Optional<GroupMember> findByGroupGroupIdAndUser_Id(int groupId, int userId);
    List<GroupMember> findByGroupGroupId(int groupId);
    List<GroupMember> findByUser_Id(int userId);
}
