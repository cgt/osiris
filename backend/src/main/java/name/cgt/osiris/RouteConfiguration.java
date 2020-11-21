package name.cgt.osiris;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration
public class RouteConfiguration {
    @Bean
    public RouterFunction<ServerResponse> itWorks() {
        return route()
          .GET("/api/it-works", request ->
            ServerResponse
              .status(HttpStatus.I_AM_A_TEAPOT)
              .contentType(MediaType.TEXT_PLAIN)
              .body("It works!")
          )
          .build();
    }
}
