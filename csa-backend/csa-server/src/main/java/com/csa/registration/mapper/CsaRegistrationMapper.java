package com.csa.registration.mapper;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.registration.entity.CsaRegistration;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CsaRegistrationMapper extends BaseMapper<CsaRegistration> {

    IPage<CsaRegistration> selectPageWithFilter(IPage<CsaRegistration> page,
                                                @Param("targetType") String targetType,
                                                @Param("targetId") Long targetId,
                                                @Param("status") String status,
                                                @Param("keyword") String keyword,
                                                @Param("regType") String regType);
}
