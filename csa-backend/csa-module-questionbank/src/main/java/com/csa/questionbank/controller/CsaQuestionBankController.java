package com.csa.questionbank.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.questionbank.entity.CsaAttachment;
import com.csa.questionbank.entity.CsaQuestionBank;
import com.csa.questionbank.service.CsaQuestionBankService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/question-bank")
@RequiredArgsConstructor
@Tag(name = "题库管理")
public class CsaQuestionBankController {

    private final CsaQuestionBankService questionBankService;

    @GetMapping
    @Operation(summary = "分页查询题库列表")
    public R<IPage<CsaQuestionBank>> list(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "年份") @RequestParam(required = false) Integer year,
            @Parameter(description = "分类") @RequestParam(required = false) String category,
            @Parameter(description = "关键�?) @RequestParam(required = false) String keyword) {
        IPage<CsaQuestionBank> result = questionBankService.listPage(page, size, year, category, keyword);
        return R.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取题库详情")
    public R<CsaQuestionBank> get(@Parameter(description = "题库ID") @PathVariable Long id) {
        return R.ok(questionBankService.getById(id));
    }

    @PostMapping
    @Operation(summary = "创建题库")
    public R<CsaQuestionBank> create(@RequestBody CsaQuestionBank questionBank) {
        return R.ok(questionBankService.save(questionBank));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新题库")
    public R<CsaQuestionBank> update(@Parameter(description = "题库ID") @PathVariable Long id,
                                     @RequestBody CsaQuestionBank questionBank) {
        return R.ok(questionBankService.update(id, questionBank));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除题库")
    public R<Void> delete(@Parameter(description = "题库ID") @PathVariable Long id) {
        questionBankService.delete(id);
        return R.ok();
    }

    @GetMapping("/{id}/attachments")
    @Operation(summary = "获取题库附件列表")
    public R<List<CsaAttachment>> getAttachments(@Parameter(description = "题库ID") @PathVariable Long id) {
        return R.ok(questionBankService.getAttachments(id));
    }

    @PostMapping("/{id}/attachments")
    @Operation(summary = "上传题库附件")
    public R<CsaAttachment> uploadAttachment(@Parameter(description = "题库ID") @PathVariable Long id,
                                             @Parameter(description = "附件文件") @RequestParam("file") MultipartFile file) {
        return R.ok(questionBankService.uploadAttachment(id, file));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @Operation(summary = "删除附件")
    public R<Void> deleteAttachment(@Parameter(description = "附件ID") @PathVariable Long attachmentId) {
        questionBankService.deleteAttachment(attachmentId);
        return R.ok();
    }
}
