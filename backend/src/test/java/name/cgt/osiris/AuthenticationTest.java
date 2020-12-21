package name.cgt.osiris;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
public class AuthenticationTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void requests_without_auth_are_forbidden() throws Exception {
        mvc
          .perform(unauthorizedRequest())
          .andExpect(status().isForbidden());
    }

    @Test
    public void given_valid_credentials_the_login_endpoint_issues_valid_auth_token() throws Exception {
        final var token = loginWithValidCredentials();

        mvc
          .perform(requestWithAuthorization(token))
          .andExpect(status().isOk());
    }


    private static MockHttpServletRequestBuilder unauthorizedRequest() {
        return get("/api/dummy");
    }

    private static MockHttpServletRequestBuilder requestWithAuthorization(String token) {
        return get("/api/dummy").header("Authorization", "Bearer " + token);
    }

    private String loginWithValidCredentials() throws Exception {
        final var result =
          mvc
            .perform(
              post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\": \"test\", \"password\": \"test\"}")
            )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
        return getTokenFromLoginResponse(result);
    }

    private String getTokenFromLoginResponse(MvcResult result) throws IOException {
        final var responseBody = result.getResponse().getContentAsString();
        final var loginResponse = objectMapper.readValue(responseBody, LoginResponse.class);
        return loginResponse.getToken();
    }

    @TestConfiguration
    static class AuthenticationTestConfiguration {
        @Bean
        public DummyController dummyController() {
            return new DummyController();
        }
    }

    @RestController
    static class DummyController {
        @GetMapping("/api/dummy")
        public String dummyResource() {
            return "Message from DummyController";
        }
    }
}
