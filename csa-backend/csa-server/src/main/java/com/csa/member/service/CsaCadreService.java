package com.csa.member.service;

/**
 * @author tanlja
 */

import com.csa.member.entity.CsaCadre;

import java.util.List;

public interface CsaCadreService {

    List<CsaCadre> listByMemberId(Long memberId);

    List<CsaCadre> listByCohort(String cohort);

    boolean save(CsaCadre cadre);

    boolean update(CsaCadre cadre);

    boolean delete(Long id);
}
