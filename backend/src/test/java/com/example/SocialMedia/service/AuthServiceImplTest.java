package com.example.SocialMedia.service;

import com.example.SocialMedia.dto.auth.LoginRequest;
import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.repository.UserRepository;
import com.example.SocialMedia.serviceImpl.authImpl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPhoneNumber("+84123456789");
    }

    @Test
    void testLogin_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setIdentifier("test@example.com");
        loginRequest.setPassword("password");

        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getPrincipal()).thenReturn(testUser);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuth);

        User result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testLogin_Fail() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setIdentifier("wrong@example.com");
        loginRequest.setPassword("password");

        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            authService.login(loginRequest);
        });

        verify(authenticationManager, never()).authenticate(any());
    }
}
