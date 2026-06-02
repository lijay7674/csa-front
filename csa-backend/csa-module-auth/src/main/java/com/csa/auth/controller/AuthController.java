package com.csa.auth.controller;

import com.csa.common.R;
import com.csa.auth.dto.LoginRequest;
import com.csa.auth.dto.LoginResponse;
import com.csa.auth.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * @author tanlja
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理", description = "后台登录认证")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "管理员登录")
    public R<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = jwtUtil.generateToken(request.getUsername());
        log.info("User {} logged in successfully", request.getUsername());
        return R.ok(new LoginResponse(token, request.getUsername()));
    }

    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息")
    public R<String> me(Authentication authentication) {
        return R.ok(authentication.getName());
    }
}
