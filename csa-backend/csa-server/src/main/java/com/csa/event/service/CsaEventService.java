package com.csa.event.service;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.event.entity.CsaEvent;

public interface CsaEventService {

    IPage<CsaEvent> listPage(int page, int size, String eventType, String status, String keyword);

    CsaEvent getById(Long id);

    CsaEvent save(CsaEvent event);

    CsaEvent update(Long id, CsaEvent event);

    void delete(Long id);
}
