package name.cgt.osiris;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/login")
public class LoginController {
    private final AuthenticationManager authManager;
    private final TokenIssuer tokenIssuer;

    public LoginController(AuthenticationManager authManager, Algorithm jwtSigner) {
        this.authManager = authManager;
        this.tokenIssuer = new TokenIssuer(jwtSigner);
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        final var auth = authenticate(request);

        final String token = tokenIssuer.issueTokenFor(username(auth));

        return ResponseEntity.ok(new LoginResponse(token));
    }

    private Authentication authenticate(LoginRequest request) {
        return authManager.authenticate(authenticationFrom(request));
    }

    private String username(Authentication auth) {
        return ((UserDetails) auth.getPrincipal()).getUsername();
    }

    private Authentication authenticationFrom(LoginRequest request) {
        return new UsernamePasswordAuthenticationToken(
          request.getUsername(),
          request.getPassword()
        );
    }
}
