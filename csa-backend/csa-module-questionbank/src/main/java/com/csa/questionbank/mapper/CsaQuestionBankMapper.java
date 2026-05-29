package com.csa.questionbank.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.questionbank.entity.CsaQuestionBank;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CsaQuestionBankMapper extends BaseMapper<CsaQuestionBank> {

    @Select("<script>" +
            "SELECT * FROM csa_question_bank WHERE 1=1" +
            "<if test='year != null'> AND year = #{year}</if>" +
            "<if test='category != null and category != \"\"'> AND category = #{category}</if>" +
            "<if test='keyword != null and keyword != \"\"'> AND (title LIKE CONCAT('%',#{keyword},'%') OR description LIKE CONCAT('%',#{keyword},'%'))</if>" +
            " ORDER BY created_at DESC" +
            "</script>")
    IPage<CsaQuestionBank> selectPageWithFilter(IPage<CsaQuestionBank> page,
                                                 @Param("year") Integer year,
                                                 @Param("category") String category,
                                                 @Param("keyword") String keyword);
}
