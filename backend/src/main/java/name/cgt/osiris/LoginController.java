package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

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
        final var auth = authenticate(request);

        final var username = ((User) auth.getPrincipal()).getUsername();
        final String token = issueTokenFor(username);

        return ResponseEntity.ok(new LoginResponse(token));
    }

    private Authentication authenticate(LoginRequest request) {
        return authManager.authenticate(authenticationFrom(request));
    }

    private Authentication authenticationFrom(LoginRequest request) {
        return new UsernamePasswordAuthenticationToken(
          request.getUsername(),
          request.getPassword()
        );
    }

    private String issueTokenFor(String username) {
        final var expiresAt = hoursFromNow(1);
        final var token =
          JWT
            .create()
            .withSubject(username)
            .withExpiresAt(expiresAt)
            .sign(jwtSigner);
        return token;
    }

    private Date hoursFromNow(int hours) {
        return Date.from(Instant.now().plus(Duration.ofHours(hours)));
    }
}
