package com.csa.content.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.content.entity.CsaContent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CsaContentMapper extends BaseMapper<CsaContent> {

    IPage<CsaContent> selectPageWithFilter(
            IPage<CsaContent> page,
            @Param("category") String category,
            @Param("status") String status,
            @Param("keyword") String keyword,
            @Param("createdBy") Long createdBy
    );
}
