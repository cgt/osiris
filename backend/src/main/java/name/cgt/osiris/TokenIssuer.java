package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

class TokenIssuer {
    private final Algorithm jwtSigner;

    TokenIssuer(Algorithm jwtSigner) {
        this.jwtSigner = jwtSigner;
    }

    String issueTokenFor(String username) {
        return JWT
          .create()
          .withSubject(username)
          .withExpiresAt(hoursFromNow(1))
          .sign(jwtSigner);
    }

    @SuppressWarnings("UseOfObsoleteDateTimeApi") // The JWT library requires a `Date`.
    private Date hoursFromNow(int hours) {
        return Date.from(Instant.now().plus(Duration.ofHours(hours)));
    }
}
