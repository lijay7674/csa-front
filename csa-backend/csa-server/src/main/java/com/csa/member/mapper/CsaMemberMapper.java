package com.csa.member.mapper;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.csa.member.entity.CsaMember;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CsaMemberMapper extends BaseMapper<CsaMember> {
}
