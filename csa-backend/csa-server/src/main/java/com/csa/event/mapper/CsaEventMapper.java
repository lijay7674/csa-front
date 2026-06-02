package com.csa.event.mapper;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.event.entity.CsaEvent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CsaEventMapper extends BaseMapper<CsaEvent> {

    @Select("<script>" +
            "SELECT * FROM csa_event WHERE 1=1" +
            "<if test='eventType != null and eventType != \"\"'> AND event_type = #{eventType}</if>" +
            "<if test='status != null and status != \"\"'> AND status = #{status}</if>" +
            "<if test='keyword != null and keyword != \"\"'> AND (title LIKE CONCAT('%',#{keyword},'%') OR description LIKE CONCAT('%',#{keyword},'%'))</if>" +
            " ORDER BY created_at DESC" +
            "</script>")
    IPage<CsaEvent> selectPageWithFilter(IPage<CsaEvent> page,
                                         @Param("eventType") String eventType,
                                         @Param("status") String status,
                                         @Param("keyword") String keyword);
}
