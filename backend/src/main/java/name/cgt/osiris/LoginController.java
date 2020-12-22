package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Controller
@RequestMapping("/api/login")
public class LoginController {
    private final AuthenticationManager authManager;
    private final Algorithm jwtSigner;

    public LoginController(AuthenticationManager authManager, Algorithm jwtSigner) {
        this.authManager = authManager;
        this.jwtSigner = jwtSigner;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        final var requestedAuth =
          new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
          );
        final var auth = authManager.authenticate(requestedAuth);

        final var username = ((User) auth.getPrincipal()).getUsername();
        final var expiresAt = Date.from(Instant.now().plus(Duration.ofHours(1)));
        final var token =
          JWT
            .create()
            .withSubject(username)
            .withExpiresAt(expiresAt)
            .sign(jwtSigner);

        return ResponseEntity.ok(new LoginResponse(token));
    }
}
