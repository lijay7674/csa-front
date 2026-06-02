package com.csa.questionbank.service;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.questionbank.entity.CsaAttachment;
import com.csa.questionbank.entity.CsaQuestionBank;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CsaQuestionBankService {
    IPage<CsaQuestionBank> listPage(int page, int size, Integer year, String category, String keyword);
    CsaQuestionBank getById(Long id);
    CsaQuestionBank save(CsaQuestionBank questionBank);
    CsaQuestionBank update(CsaQuestionBank questionBank);
    void delete(Long id);
    List<CsaAttachment> getAttachments(Long questionId);
    CsaAttachment uploadAttachment(Long questionId, MultipartFile file);
    void deleteAttachment(Long id);
}
