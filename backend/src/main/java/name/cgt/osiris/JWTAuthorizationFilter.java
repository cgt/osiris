package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
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
        Optional
          .ofNullable(request.getHeader("Authorization"))
          .flatMap(tokenAuthorizer::authFromHeader)
          .ifPresent(authentication ->
            setAuthentication(authentication)
          );

        chain.doFilter(request, response);
    }

    private void setAuthentication(Authentication authentication) {
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
