package com.example.SocialMedia.service;

import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.serviceImpl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("testuser");
        testUser.setEmail("test@example.com");
    }

    @Test
    void testLoadProfile_Success() {
        when(userRepository.findByUserName("testuser")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findByUsername("testuser");

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userRepository, times(1)).findByUserName("testuser");
    }

    @Test
    void testLoadProfile_NotFound() {
        when(userRepository.findByUserName("nonexistent")).thenReturn(Optional.empty());

        Optional<User> result = userService.findByUsername("nonexistent");

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUserName("nonexistent");
    }
}
