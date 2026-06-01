package com.csa.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.csa.content.entity.CsaContent;
import com.csa.content.mapper.CsaContentMapper;
import com.csa.content.service.CsaContentService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
public class CsaContentServiceImpl extends ServiceImpl<CsaContentMapper, CsaContent> implements CsaContentService {

    @Override
    public IPage<CsaContent> listPage(int page, int size, String category, String status, String keyword, Long createdBy) {
        Page<CsaContent> pageParam = new Page<>(page, size);
        return baseMapper.selectPageWithFilter(pageParam, category, status, keyword, createdBy);
    }

    @Override
    public CsaContent getById(Long id) {
        CsaContent content = baseMapper.selectById(id);
        if (content == null) {
            throw new IllegalArgumentException("内容不存在");
        }
        return content;
    }

    @Override
    public CsaContent save(CsaContent content) {
        baseMapper.insert(content);
        return content;
    }

    @Override
    public CsaContent update(CsaContent content) {
        CsaContent existing = getById(content.getId());
        existing.setTitle(content.getTitle());
        existing.setCategory(content.getCategory());
        existing.setSummary(content.getSummary());
        existing.setBody(content.getBody());
        existing.setCoverImage(content.getCoverImage());
        existing.setSource(content.getSource());
        baseMapper.updateById(existing);
        return existing;
    }

    @Override
    public void delete(Long id) {
        getById(id);
        baseMapper.deleteById(id);
    }

    @Override
    public void submitForReview(Long id) {
        CsaContent content = getById(id);
        if (!"DRAFT".equals(content.getStatus()) && !"AI_DRAFT".equals(content.getStatus())) {
            throw new IllegalArgumentException("只有草稿或AI初稿状态的内容才能提交审核");
        }
        content.setStatus("PENDING_REVIEW");
        baseMapper.updateById(content);
    }

    @Override
    public void approve(Long id, String comment, Long reviewedBy) {
        CsaContent content = getById(id);
        if (!"PENDING_REVIEW".equals(content.getStatus())) {
            throw new IllegalArgumentException("只有待审核状态的内容才能审核通过");
        }
        content.setStatus("PUBLISHED");
        content.setPublishedAt(LocalDateTime.now());
        content.setReviewedBy(reviewedBy);
        if (StringUtils.hasText(comment)) {
            content.setReviewComment(comment);
        }
        baseMapper.updateById(content);
    }

    @Override
    public void reject(Long id, String comment, Long reviewedBy) {
        CsaContent content = getById(id);
        if (!"PENDING_REVIEW".equals(content.getStatus())) {
            throw new IllegalArgumentException("只有待审核状态的内容才能驳回");
        }
        content.setStatus("DRAFT");
        content.setReviewComment(comment);
        content.setReviewedBy(reviewedBy);
        baseMapper.updateById(content);
    }

    @Override
    public void offline(Long id) {
        CsaContent content = getById(id);
        if (!"PUBLISHED".equals(content.getStatus())) {
            throw new IllegalArgumentException("只有已发布状态的内容才能下线");
        }
        content.setStatus("OFFLINE");
        baseMapper.updateById(content);
    }
}
