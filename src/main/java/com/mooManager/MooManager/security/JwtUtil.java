package com.mooManager.MooManager.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final long EXPIRATION_MS = 86400000; // 1 dia
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String email, String role, String cnir) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("cnir", cnir)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return parseToken(token).getBody().getSubject();
    }

    public String getRoleFromToken(String token) {
        return (String) parseToken(token).getBody().get("role");
    }

    public String getCnirFromToken(String token) {
        return (String) parseToken(token).getBody().get("cnir");
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
