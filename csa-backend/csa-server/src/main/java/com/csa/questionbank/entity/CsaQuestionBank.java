package com.csa.questionbank.entity;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("csa_question_bank")
public class CsaQuestionBank {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private Integer year;

    private String category;

    private String source;

    private String description;

    private String copyrightNote;

    private Integer isPublic;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
