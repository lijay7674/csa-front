package com.csa.event.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.event.entity.CsaEvent;
import com.csa.event.mapper.CsaEventMapper;
import com.csa.event.service.CsaEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CsaEventServiceImpl implements CsaEventService {

    private final CsaEventMapper eventMapper;

    @Override
    public IPage<CsaEvent> listPage(int page, int size, String eventType, String status, String keyword) {
        Page<CsaEvent> pageParam = new Page<>(page, size);
        return eventMapper.selectPageWithFilter(pageParam, eventType, status, keyword);
    }

    @Override
    public CsaEvent getById(Long id) {
        return eventMapper.selectById(id);
    }

    @Override
    public CsaEvent save(CsaEvent event) {
        eventMapper.insert(event);
        return event;
    }

    @Override
    public CsaEvent update(Long id, CsaEvent event) {
        event.setId(id);
        eventMapper.updateById(event);
        return eventMapper.selectById(id);
    }

    @Override
    public void delete(Long id) {
        eventMapper.deleteById(id);
    }
}
