package tn.tunisair.workfow.Config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import tn.tunisair.workfow.Entities.User;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generateToken(Optional<User> user) {
        User userEntity = user.orElseThrow(() -> new IllegalArgumentException("User not found"));
        return Jwts.builder()
                .setSubject(userEntity.getUsername())
                .setIssuedAt(new Date())
                .signWith(SECRET_KEY)
                .compact();
    }
}
