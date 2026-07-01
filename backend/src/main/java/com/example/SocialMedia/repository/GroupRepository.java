package com.example.SocialMedia.repository;

import com.example.SocialMedia.model.coredata_model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    @Query("SELECT g FROM Group g WHERE g.name LIKE %:query% OR g.description LIKE %:query%")
    List<Group> searchGroups(@Param("query") String query);
}
