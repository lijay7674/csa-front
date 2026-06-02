package com.csa.competition.service.impl;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.competition.entity.CsaCompetition;
import com.csa.competition.entity.CsaCompetitionAward;
import com.csa.competition.mapper.CsaCompetitionAwardMapper;
import com.csa.competition.mapper.CsaCompetitionMapper;
import com.csa.competition.service.CsaCompetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CsaCompetitionServiceImpl implements CsaCompetitionService {

    private final CsaCompetitionMapper competitionMapper;
    private final CsaCompetitionAwardMapper awardMapper;

    @Override
    public IPage<CsaCompetition> listPage(int page, int size, String level, String compType, Integer year, String status, String keyword) {
        IPage<CsaCompetition> pageParam = new Page<>(page, size);
        return competitionMapper.selectPageWithFilter(pageParam, level, compType, year, status, keyword);
    }

    @Override
    public CsaCompetition getById(Long id) {
        return competitionMapper.selectById(id);
    }

    @Override
    public boolean save(CsaCompetition competition) {
        return competitionMapper.insert(competition) > 0;
    }

    @Override
    public boolean update(CsaCompetition competition) {
        return competitionMapper.updateById(competition) > 0;
    }

    @Override
    public boolean delete(Long id) {
        return competitionMapper.deleteById(id) > 0;
    }

    @Override
    public List<CsaCompetitionAward> getAwards(Long competitionId) {
        return awardMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<CsaCompetitionAward>()
                        .eq(CsaCompetitionAward::getCompetitionId, competitionId)
                        .orderByDesc(CsaCompetitionAward::getCreatedAt)
        );
    }

    @Override
    public boolean addAward(CsaCompetitionAward award) {
        return awardMapper.insert(award) > 0;
    }

    @Override
    public boolean updateAward(CsaCompetitionAward award) {
        return awardMapper.updateById(award) > 0;
    }

    @Override
    public boolean deleteAward(Long id) {
        return awardMapper.deleteById(id) > 0;
    }
}
