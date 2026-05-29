package com.csa.member.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.member.entity.CsaMember;
import com.csa.member.mapper.CsaMemberMapper;
import com.csa.member.service.CsaMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CsaMemberServiceImpl implements CsaMemberService {

    private final CsaMemberMapper csaMemberMapper;

    @Override
    public IPage<CsaMember> listPage(int page, int size, String cohort, String major, String status, String keyword) {
        Page<CsaMember> pageParam = new Page<>(page, size);
        return csaMemberMapper.selectPageWithFilter(pageParam, cohort, major, status, keyword);
    }

    @Override
    public CsaMember getById(Long id) {
        return csaMemberMapper.selectById(id);
    }

    @Override
    public boolean save(CsaMember member) {
        return csaMemberMapper.insert(member) > 0;
    }

    @Override
    public boolean update(CsaMember member) {
        return csaMemberMapper.updateById(member) > 0;
    }

    @Override
    public boolean delete(Long id) {
        return csaMemberMapper.deleteById(id) > 0;
    }

    @Override
    public boolean updateStatus(Long id, String status) {
        CsaMember member = new CsaMember();
        member.setId(id);
        member.setStatus(status);
        return csaMemberMapper.updateById(member) > 0;
    }
}
