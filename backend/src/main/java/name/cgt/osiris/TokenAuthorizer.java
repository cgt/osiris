package name.cgt.osiris;

import com.auth0.jwt.JWTVerifier;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

public class TokenAuthorizer {
    private final JWTVerifier jwt;

    TokenAuthorizer(JWTVerifier jwt) {
        this.jwt = jwt;
    }

    Optional<Authentication> authFromHeader(@Nullable String authorizationHeader) {
        var auth = Optional.<Authentication>empty();
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            final var token = authorizationHeader.replace("Bearer ", "");
            final var username = Optional.ofNullable(jwt.verify(token).getSubject());
            if (username.isPresent()) {
                auth = username.map(this::authForUser);
            } else {
                auth = username.map(this::authForUser);
            }
        }
        return auth;
    }

    private Authentication authForUser(String username) {
        return new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }
}
