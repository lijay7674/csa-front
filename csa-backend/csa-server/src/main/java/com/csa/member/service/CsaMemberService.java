package com.csa.member.service;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.member.entity.CsaMember;

public interface CsaMemberService {

    IPage<CsaMember> listPage(int page, int size, String cohort, String major, String status, String keyword);

    CsaMember getById(Long id);

    boolean save(CsaMember member);

    boolean update(CsaMember member);

    boolean delete(Long id);

    boolean updateStatus(Long id, String status);
}
