package name.cgt.osiris;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
          .csrf().disable()
          .logout().disable()
          .authorizeRequests()
          .antMatchers("/api/login").permitAll()
          .antMatchers("/api/**").authenticated()
          .and()
          .addFilterAfter(new JWTAuthorizationFilter(jwtSigningAlgorithm()), BasicAuthenticationFilter.class)
          .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        final var testUser =
          User
            .withUsername("test")
            .password("{noop}test")
            .roles("USER");
        auth
          .inMemoryAuthentication()
          .withUser(testUser);
    }

    @Bean
    public Algorithm jwtSigningAlgorithm() {
        return Algorithm.HMAC512("DUMMY SECRET"); // TODO: Externalize secret.
    }
}
