package com.csa.competition.service;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.competition.entity.CsaCompetition;
import com.csa.competition.entity.CsaCompetitionAward;

import java.util.List;

public interface CsaCompetitionService {

    IPage<CsaCompetition> listPage(int page, int size, String level, String compType, Integer year, String status, String keyword);

    CsaCompetition getById(Long id);

    boolean save(CsaCompetition competition);

    boolean update(CsaCompetition competition);

    boolean delete(Long id);

    List<CsaCompetitionAward> getAwards(Long competitionId);

    boolean addAward(CsaCompetitionAward award);

    boolean updateAward(CsaCompetitionAward award);

    boolean deleteAward(Long id);
}
