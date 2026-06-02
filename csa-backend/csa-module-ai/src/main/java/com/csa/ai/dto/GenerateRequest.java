package com.csa.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * @author tanlja
 */
@Data
public class GenerateRequest {
    @NotBlank(message = "提示词不能为空")
    private String prompt;
    private String style = "正式";
}
