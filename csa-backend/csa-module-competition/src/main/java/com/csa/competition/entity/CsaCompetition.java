package com.csa.competition.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("csa_competition")
public class CsaCompetition {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String level;

    private String compType;

    private Integer year;

    private String organizer;

    private String regMethod;

    private LocalDateTime regDeadline;

    private String status;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
