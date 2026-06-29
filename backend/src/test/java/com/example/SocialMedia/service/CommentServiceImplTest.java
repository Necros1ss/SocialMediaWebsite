package com.example.SocialMedia.service;

import com.example.SocialMedia.dto.request.CommentRequest;
import com.example.SocialMedia.dto.response.CommentResponse;
import com.example.SocialMedia.dto.response.ReactionStat;
import com.example.SocialMedia.model.coredata_model.Comment;
import com.example.SocialMedia.model.coredata_model.InteractableItems;
import com.example.SocialMedia.model.coredata_model.Post;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.CommentRepository;
import com.example.SocialMedia.repository.PostRepository;
import com.example.SocialMedia.repository.ReactionRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.InteractableItemService;
import com.example.SocialMedia.serviceImpl.social.CommentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private InteractableItemService interactableItemService;

    @Mock
    private ReactionRepository reactionRepository;

    @InjectMocks
    private CommentServiceImpl commentService;

    private User testUser;
    private Post testPost;
    private Comment testComment;
    private SecurityContext securityContext;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("testuser");

        testPost = new Post();
        testPost.setPostId(100);
        InteractableItems postItem = new InteractableItems();
        postItem.setInteractableItemId(50);
        testPost.setInteractableItem(postItem);

        testComment = new Comment();
        testComment.setCommentId(200);
        testComment.setUser(testUser);
        testComment.setContent("Test Comment");
        InteractableItems commentItem = new InteractableItems();
        commentItem.setInteractableItemId(60);
        testComment.setOwnInteractableItem(commentItem);

        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testCreateComment_Success() {
        CommentRequest request = new CommentRequest();
        request.setTargetInteractableItemID(50);
        request.setContent("Test Content");
        request.setCreatedAt(LocalDateTime.now());

        InteractableItems commentItem = new InteractableItems();
        commentItem.setInteractableItemId(60);

        when(userRepository.findByUserName("testuser")).thenReturn(Optional.of(testUser));
        when(postRepository.findByInteractableItem_InteractableItemId(50)).thenReturn(Optional.of(testPost));
        when(interactableItemService.createInteractableItems(eq("COMMENT"), any(LocalDateTime.class))).thenReturn(commentItem);
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);
        when(reactionRepository.countReactionsByInteractableItemId(60)).thenReturn(new ArrayList<>());

        CommentResponse result = commentService.createComment("testuser", request);

        assertNotNull(result);
        assertEquals("Test Comment", result.getContent());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void testDeleteComment_OwnComment() {
        when(commentRepository.findByCommentId(200)).thenReturn(Optional.of(testComment));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);
        when(reactionRepository.countReactionsByInteractableItemId(60)).thenReturn(new ArrayList<>());

        CommentResponse result = commentService.deleteComment(200);

        assertNotNull(result);
        assertTrue(testComment.isDeleted());
        verify(commentRepository, times(1)).save(testComment);
    }

    @Test
    void testDeleteComment_OtherComment_ThrowsAccessDenied() {
        User otherUser = new User();
        otherUser.setId(2);
        otherUser.setUserName("otheruser");

        when(commentRepository.findByCommentId(200)).thenReturn(Optional.of(testComment));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(otherUser);

        assertThrows(AccessDeniedException.class, () -> {
            commentService.deleteComment(200);
        });

        assertFalse(testComment.isDeleted());
        verify(commentRepository, never()).save(any());
    }
}
