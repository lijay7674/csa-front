package com.csa.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author tanlja
 */
@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
}
