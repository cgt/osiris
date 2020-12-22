package name.cgt.osiris;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
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
    private final JWTVerifier jwt;

    public JWTAuthorizationFilter(Algorithm jwtSigner) {
        jwt = JWT.require(jwtSigner).build();
    }

    @Override
    protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain chain
    ) throws IOException, ServletException {
        final var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            final var token = authorizationHeader.replace("Bearer ", "");
            final var username = jwt.verify(token).getSubject();
            final var optionalUsername = Optional.ofNullable(username);
            var auth = Optional.<Authentication>empty();
            if (username != null) {
                auth = Optional.of(new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))));
            }
            auth.ifPresent(authentication -> SecurityContextHolder.getContext().setAuthentication(authentication));
        }

        chain.doFilter(request, response);
    }
}
