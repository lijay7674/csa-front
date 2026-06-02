package com.csa.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author tanlja
 */
@Data
public class PolishRequest {
    @NotBlank(message = "内容不能为空")
    private String content;
    private String style = "流畅";
}
