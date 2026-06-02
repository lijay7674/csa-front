package com.csa.member.service.impl;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.csa.member.entity.CsaCadre;
import com.csa.member.mapper.CsaCadreMapper;
import com.csa.member.service.CsaCadreService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CsaCadreServiceImpl implements CsaCadreService {

    private final CsaCadreMapper csaCadreMapper;

    @Override
    public List<CsaCadre> listByMemberId(Long memberId) {
        LambdaQueryWrapper<CsaCadre> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaCadre::getMemberId, memberId)
               .orderByDesc(CsaCadre::getCohort);
        return csaCadreMapper.selectList(wrapper);
    }

    @Override
    public List<CsaCadre> listByCohort(String cohort) {
        LambdaQueryWrapper<CsaCadre> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaCadre::getCohort, cohort)
               .orderByDesc(CsaCadre::getStartDate);
        return csaCadreMapper.selectList(wrapper);
    }

    @Override
    public boolean save(CsaCadre cadre) {
        return csaCadreMapper.insert(cadre) > 0;
    }

    @Override
    public boolean update(CsaCadre cadre) {
        return csaCadreMapper.updateById(cadre) > 0;
    }

    @Override
    public boolean delete(Long id) {
        return csaCadreMapper.deleteById(id) > 0;
    }
}
