package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TokenAuthorizerTest {

    private final Algorithm signingAlgorithm = Algorithm.none();
    private final JWTVerifier jwtVerifier = JWT.require(signingAlgorithm).build();
    private final TokenAuthorizer authorizer = new TokenAuthorizer(jwtVerifier);

    @Test
    public void valid_token_is_authorized() {
        final var validToken =
          JWT
            .create()
            .withSubject("username")
            .withExpiresAt(farInTheFuture())
            .sign(signingAlgorithm);

        final var authentication = authorizer.authFromHeader("Bearer " + validToken);

        assertThat(authentication)
          .hasValue(new UsernamePasswordAuthenticationToken("username", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))));
    }

    @Test
    public void token_without_username_is_unauthorized() {
        final var tokenWithoutUsername =
          JWT
            .create()
            .withExpiresAt(farInTheFuture())
            .sign(signingAlgorithm);

        final var authentication = authorizer.authFromHeader("Bearer " + tokenWithoutUsername);

        assertThat(authentication).isEmpty();
    }

    @SuppressWarnings("UseOfObsoleteDateTimeApi")
    private static Date farInTheFuture() {
        return Date.from(Instant.now().plus(Duration.ofDays(1000)));
    }
}