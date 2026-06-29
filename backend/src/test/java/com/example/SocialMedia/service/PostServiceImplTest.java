package com.example.SocialMedia.service;

import com.example.SocialMedia.dto.request.PostRequest;
import com.example.SocialMedia.dto.response.PostResponse;
import com.example.SocialMedia.exception.ResourceNotFound.PostNotFoundException;
import com.example.SocialMedia.mapper.PostMapper;
import com.example.SocialMedia.model.coredata_model.InteractableItems;
import com.example.SocialMedia.model.coredata_model.Post;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.PostRepository;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.service.social.InteractableItemService;
import com.example.SocialMedia.serviceImpl.social.PostServiceImpl;
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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostServiceImplTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InteractableItemService interactableItemService;

    @Mock
    private PostMapper postMapper;

    @InjectMocks
    private PostServiceImpl postService;

    private User testUser;
    private Post testPost;
    private SecurityContext securityContext;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("testuser");

        testPost = new Post();
        testPost.setPostId(100);
        testPost.setUser(testUser);
        testPost.setContent("Hello World");

        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testCreatePost_Success() {
        PostRequest request = new PostRequest();
        request.setContent("Content");
        request.setPostTopic("Topic");
        request.setCreatedAt(LocalDateTime.now());

        InteractableItems item = new InteractableItems();
        item.setInteractableItemId(10);

        when(userRepository.findByUserName("testuser")).thenReturn(Optional.of(testUser));
        when(interactableItemService.createInteractableItems(eq("POST"), any(LocalDateTime.class))).thenReturn(item);
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(postMapper.toPostResponse(any(Post.class))).thenReturn(new PostResponse());

        PostResponse result = postService.createPost("testuser", request, new MultipartFile[0]);

        assertNotNull(result);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void testDeletePost_OwnPost() {
        when(postRepository.findById(100)).thenReturn(Optional.of(testPost));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        when(postMapper.toPostResponse(any(Post.class))).thenReturn(new PostResponse());

        PostResponse result = postService.deletePost(100);

        assertNotNull(result);
        assertTrue(testPost.isDeleted());
        verify(postRepository, times(1)).save(testPost);
    }

    @Test
    void testDeletePost_OtherPost_ThrowsAccessDenied() {
        User otherUser = new User();
        otherUser.setId(2);
        otherUser.setUserName("otheruser");

        when(postRepository.findById(100)).thenReturn(Optional.of(testPost));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(otherUser);

        assertThrows(AccessDeniedException.class, () -> {
            postService.deletePost(100);
        });

        assertFalse(testPost.isDeleted());
        verify(postRepository, never()).save(any());
    }
}
