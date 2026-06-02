package com.csa.ai.controller;

import com.csa.common.R;
import com.csa.ai.dto.GenerateRequest;
import com.csa.ai.dto.PolishRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @author tanlja
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/ai")
@Tag(name = "AI内容助手")
public class AiController {

    @PostMapping("/generate")
    @Operation(summary = "AI生成内容")
    public R<Map<String, String>> generate(@Valid @RequestBody GenerateRequest request) {
        log.info("AI生成请求 - prompt: {}, style: {}", request.getPrompt(), request.getStyle());
        // TODO: 接入LLM API，当前返回占位内容
        String generated = "AI生成内容: " + request.getPrompt();
        return R.ok(Map.of("content", generated));
    }

    @PostMapping("/polish")
    @Operation(summary = "AI润色内容")
    public R<Map<String, String>> polish(@Valid @RequestBody PolishRequest request) {
        log.info("AI润色请求 - content: {}, style: {}", request.getContent(), request.getStyle());
        // TODO: 接入LLM API，当前返回占位内容
        String polished = "AI润色内容: " + request.getContent();
        return R.ok(Map.of("content", polished));
    }
}
