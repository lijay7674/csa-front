package com.csa.content.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.content.entity.CsaContent;

public interface CsaContentService {

    IPage<CsaContent> listPage(int page, int size, String category, String status, String keyword, Long createdBy);

    CsaContent getById(Long id);

    CsaContent save(CsaContent content);

    CsaContent update(CsaContent content);

    void delete(Long id);

    void submitForReview(Long id);

    void approve(Long id, String comment, Long reviewedBy);

    void reject(Long id, String comment, Long reviewedBy);

    void offline(Long id);
}
