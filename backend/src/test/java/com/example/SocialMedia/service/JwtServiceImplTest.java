package com.example.SocialMedia.service;

import com.example.SocialMedia.model.coredata_model.User;
import com.example.SocialMedia.serviceImpl.authImpl.JwtServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceImplTest {

    private JwtServiceImpl jwtService;
    private User testUser;
    
    // 36-byte secret key encoded in Base64
    private static final String SECRET_KEY = "dGVzdF9zZWNyZXRfdGVzdF9zZWNyZXRfdGVzdF9zZWNyZXRfdGVzdF9zZWNyZXQ=";
    private static final long ACCESS_EXPIRATION = 3600000; // 1 hour in ms

    @BeforeEach
    void setUp() {
        jwtService = new JwtServiceImpl();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "accessExpiration", ACCESS_EXPIRATION);

        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("testuser");
        testUser.setEmail("testuser@example.com");
    }

    @Test
    void testGenerateAccessToken_Success() {
        String token = jwtService.generateAccessToken(testUser);
        assertNotNull(token);
        assertFalse(token.isEmpty());
        
        String username = jwtService.extractUsername(token);
        assertEquals("testuser", username);
    }

    @Test
    void testGenerateToken_WithExtraClaims() {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ROLE_USER");
        
        String token = jwtService.generateToken(extraClaims, testUser, 1800000);
        assertNotNull(token);
        
        String username = jwtService.extractUsername(token);
        assertEquals("testuser", username);
        
        assertFalse(jwtService.isTokenExpired(token));
    }

    @Test
    void testIsTokenValid_Success() {
        String token = jwtService.generateAccessToken(testUser);
        boolean isValid = jwtService.isTokenValid(token, testUser);
        assertTrue(isValid);
    }

    @Test
    void testIsTokenValid_InvalidUsername() {
        String token = jwtService.generateAccessToken(testUser);
        
        User differentUser = new User();
        differentUser.setUserName("otheruser");
        
        boolean isValid = jwtService.isTokenValid(token, differentUser);
        assertFalse(isValid);
    }

    @Test
    void testIsTokenExpired_False() {
        String token = jwtService.generateAccessToken(testUser);
        assertFalse(jwtService.isTokenExpired(token));
    }

    @Test
    void testExtractExpiration() {
        String token = jwtService.generateAccessToken(testUser);
        Date expiration = jwtService.extractExpiration(token);
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void testGenerateRefreshToken() {
        String refreshToken = jwtService.generateRefreshToken();
        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
        // Verify it looks like a UUID
        assertTrue(refreshToken.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"));
    }
}
