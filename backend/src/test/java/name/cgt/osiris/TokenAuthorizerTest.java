package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import static org.assertj.core.api.Assertions.allOf;
import static org.assertj.core.api.Assertions.assertThat;

public class TokenAuthorizerTest {

    private final Algorithm signingAlgorithm = Algorithm.none();
    private final JWTVerifier jwtVerifier = JWT.require(signingAlgorithm).build();
    private final TokenAuthorizer authorizer = new TokenAuthorizer(jwtVerifier);

    @Test
    public void valid_token_is_authorized() {
        final var token = validTokenForUser("username");

        final var authentication = authorizer.authFromHeader(token);

        assertThat(authentication)
          .hasValueSatisfying(allOf(isAuthenticated(), hasUsername("username")));
    }

    @Test
    public void token_without_username_is_unauthorized() {
        final var token = tokenWithoutUsername();

        final var authentication = authorizer.authFromHeader(token);

        assertThat(authentication).isEmpty();
    }

    @Test
    public void null_token_is_unauthorized() {
        final var authentication = authorizer.authFromHeader(null);

        assertThat(authentication).isEmpty();
    }

    @Test
    public void token_without_Bearer_prefix_is_unauthorized() {
        final var improperlyFormattedToken = "improper token prefix" + validTokenForUser("username");

        final var authentication = authorizer.authFromHeader(improperlyFormattedToken);

        assertThat(authentication).isEmpty();
    }

    private String validTokenForUser(String username) {
        final var token =
          JWT
            .create()
            .withSubject(username)
            .withExpiresAt(farInTheFuture())
            .sign(signingAlgorithm);

        return formatBearerToken(token);
    }

    private String tokenWithoutUsername() {
        final var token =
          JWT
            .create()
            .withExpiresAt(farInTheFuture())
            .sign(signingAlgorithm);

        return formatBearerToken(token);
    }

    private static String formatBearerToken(String validToken) {
        return "Bearer " + validToken;
    }

    @SuppressWarnings("UseOfObsoleteDateTimeApi")
    private static Date farInTheFuture() {
        return Date.from(Instant.now().plus(Duration.ofDays(1000)));
    }

    private static Condition<Authentication> isAuthenticated() {
        return new Condition<>(Authentication::isAuthenticated, "is authenticated");
    }

    private static Condition<Authentication> hasUsername(String username) {
        return new Condition<>(
          auth -> username.equals(auth.getPrincipal()),
          "has username \"%s\"", username
        );
    }
}