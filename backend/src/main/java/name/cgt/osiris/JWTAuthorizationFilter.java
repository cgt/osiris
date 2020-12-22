package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class JWTAuthorizationFilter extends OncePerRequestFilter {
    private final TokenAuthorizer tokenAuthorizer;

    public JWTAuthorizationFilter(Algorithm jwtSigner) {
        final var jwt = JWT.require(jwtSigner).build();
        tokenAuthorizer = new TokenAuthorizer(jwt);
    }

    @Override
    protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain
    ) throws IOException, ServletException {
        final var authorizationHeader = request.getHeader("Authorization");
        tokenAuthorizer.authFromHeader(authorizationHeader)
          .ifPresent(authentication ->
            SecurityContextHolder.getContext().setAuthentication(authentication)
          );

        chain.doFilter(request, response);
    }

    public static class TokenAuthorizer {
        private JWTVerifier jwt;

        public TokenAuthorizer() {
        }

        TokenAuthorizer(JWTVerifier jwt) {
            this.jwt = jwt;
        }

        private Optional<Authentication> authFromHeader(@Nullable String authorizationHeader) {
            var auth = Optional.<Authentication>empty();
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                final var token = authorizationHeader.replace("Bearer ", "");
                final var username = Optional.ofNullable(jwt.verify(token).getSubject());
                if (username.isPresent()) {
                    auth = username.map(this::authForUser);
                }
            }
            return auth;
        }

        private Authentication authForUser(String username) {
            return new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        }
    }
}
