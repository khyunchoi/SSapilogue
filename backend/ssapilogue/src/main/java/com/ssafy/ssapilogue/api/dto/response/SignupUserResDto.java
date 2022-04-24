package com.ssafy.ssapilogue.api.dto.response;

import com.ssafy.ssapilogue.core.domain.User;
import com.ssafy.ssapilogue.core.domain.UserIdentity;
import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@ApiModel("SignupUserResDto")
public class SignupUserResDto {

    private String email;

    private String nickname;

    private String github;

    private UserIdentity userIdentity;

    public SignupUserResDto(User user) {
        email = user.getEmail();
        nickname = user.getNickname();
        github = user.getGithub();
        userIdentity = user.getUserIdentity();
    }
}
