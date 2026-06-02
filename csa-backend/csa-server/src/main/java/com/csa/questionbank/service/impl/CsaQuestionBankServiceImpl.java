package com.csa.questionbank.service.impl;

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
import com.csa.questionbank.service.CsaQuestionBankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsaQuestionBankServiceImpl implements CsaQuestionBankService {

    private final CsaQuestionBankMapper questionBankMapper;
    private final CsaAttachmentMapper attachmentMapper;

    private static final String UPLOAD_DIR = "D:/csa-files/";

    @Override
    public IPage<CsaQuestionBank> listPage(int page, int size, Integer year, String category, String keyword) {
        return questionBankMapper.selectPageWithFilter(new Page<>(page, size), year, category, keyword);
    }

    @Override
    public CsaQuestionBank getById(Long id) {
        return questionBankMapper.selectById(id);
    }

    @Override
    public CsaQuestionBank save(CsaQuestionBank questionBank) {
        questionBankMapper.insert(questionBank);
        return questionBank;
    }

    @Override
    public CsaQuestionBank update(CsaQuestionBank questionBank) {
        questionBankMapper.updateById(questionBank);
        return questionBank;
    }

    @Override
    public void delete(Long id) {
        questionBankMapper.deleteById(id);
    }

    @Override
    public List<CsaAttachment> getAttachments(Long questionId) {
        return attachmentMapper.selectList(
                new LambdaQueryWrapper<CsaAttachment>().eq(CsaAttachment::getQuestionId, questionId));
    }

    @Override
    public CsaAttachment uploadAttachment(Long questionId, MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String storedName = UUID.randomUUID().toString() + "_" + originalName;
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(storedName);
            file.transferTo(filePath.toFile());

            CsaAttachment attachment = new CsaAttachment();
            attachment.setQuestionId(questionId);
            attachment.setOriginalName(originalName);
            attachment.setStoredName(storedName);
            attachment.setFilePath(filePath.toString());
            attachment.setFileSize(file.getSize());
            attachment.setMimeType(file.getContentType());
            attachment.setDownloadCount(0);
            attachmentMapper.insert(attachment);
            return attachment;
        } catch (IOException e) {
            log.error("Failed to upload file", e);
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }

    @Override
    public void deleteAttachment(Long id) {
        CsaAttachment att = attachmentMapper.selectById(id);
        if (att != null) {
            try {
                Files.deleteIfExists(Paths.get(att.getFilePath()));
            } catch (IOException e) {
                log.warn("Failed to delete file: {}", att.getFilePath());
            }
            attachmentMapper.deleteById(id);
        }
    }
}
