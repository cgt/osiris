package name.cgt.osiris;

import lombok.Data;
import org.springframework.lang.Nullable;

@Data
public class LoginRequest {
    @Nullable
    private String username;

    @Nullable
    private String password;
}
