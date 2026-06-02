package com.csa.content.controller;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.content.entity.CsaContent;
import com.csa.content.service.CsaContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/contents")
@RequiredArgsConstructor
@Tag(name = "内容管理")
public class CsaContentController {

    private final CsaContentService csaContentService;

    @GetMapping
    @Operation(summary = "分页查询内容列表")
    public R<IPage<CsaContent>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long createdBy) {
        IPage<CsaContent> result = csaContentService.listPage(page, size, category, status, keyword, createdBy);
        return R.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取内容详情")
    public R<CsaContent> get(@PathVariable Long id) {
        return R.ok(csaContentService.getById(id));
    }

    @PostMapping
    @Operation(summary = "创建内容")
    public R<CsaContent> create(@RequestBody CsaContent content) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            content.setCreatedBy(1L);
        }
        return R.ok(csaContentService.save(content));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新内容")
    public R<CsaContent> update(@PathVariable Long id, @RequestBody CsaContent content) {
        content.setId(id);
        return R.ok(csaContentService.update(content));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除内容")
    public R<Void> delete(@PathVariable Long id) {
        csaContentService.delete(id);
        return R.ok();
    }

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "提交审核")
    public R<Void> submitForReview(@PathVariable Long id) {
        csaContentService.submitForReview(id);
        return R.ok();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "审核通过")
    public R<Void> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long reviewedBy = 1L;
        String comment = body != null ? body.getOrDefault("comment", "") : "";
        csaContentService.approve(id, comment, reviewedBy);
        return R.ok();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "驳回内容")
    public R<Void> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long reviewedBy = 1L;
        String comment = body != null ? body.getOrDefault("comment", "") : "";
        csaContentService.reject(id, comment, reviewedBy);
        return R.ok();
    }

    @PostMapping("/{id}/offline")
    @Operation(summary = "下线内容")
    public R<Void> offline(@PathVariable Long id) {
        csaContentService.offline(id);
        return R.ok();
    }
}
