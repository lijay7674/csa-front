package com.csa.aggregate.publicapi;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.questionbank.entity.CsaAttachment;
import com.csa.questionbank.entity.CsaQuestionBank;
import com.csa.questionbank.mapper.CsaAttachmentMapper;
import com.csa.questionbank.mapper.CsaQuestionBankMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/public/question-bank")
@RequiredArgsConstructor
@Tag(name = "前台题库", description = "公开题库浏览与下载")
public class PublicQuestionBankController {

    private final CsaQuestionBankMapper questionBankMapper;
    private final CsaAttachmentMapper attachmentMapper;

    @GetMapping
    @Operation(summary = "公开题库列表")
    public IPage<CsaQuestionBank> list(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "20") int size,
                                        @RequestParam(required = false) Integer year,
                                        @RequestParam(required = false) String category,
                                        @RequestParam(required = false) String keyword) {
        return questionBankMapper.selectPageWithFilter(
                new Page<>(page, size), year, category, keyword);
    }

    @GetMapping("/{id}/attachments/{attachmentId}/download")
    @Operation(summary = "下载附件")
    public void download(@PathVariable Long id,
                         @PathVariable Long attachmentId,
                         HttpServletResponse response) throws IOException {
        CsaAttachment att = attachmentMapper.selectById(attachmentId);
        if (att == null || !att.getQuestionId().equals(id)) {
            response.setStatus(404);
            return;
        }
        CsaQuestionBank qb = questionBankMapper.selectById(id);
        if (qb == null || qb.getIsPublic() != 1) {
            response.setStatus(404);
            return;
        }
        File file = new File(att.getFilePath());
        if (!file.exists()) {
            response.setStatus(404);
            return;
        }
        response.setContentType(att.getMimeType() != null ? att.getMimeType() : "application/octet-stream");
        response.setHeader("Content-Disposition",
                "attachment; filename=\"" + URLEncoder.encode(att.getOriginalName(), StandardCharsets.UTF_8) + "\"");
        att.setDownloadCount(att.getDownloadCount() + 1);
        attachmentMapper.updateById(att);
        Files.copy(file.toPath(), response.getOutputStream());
    }
}
