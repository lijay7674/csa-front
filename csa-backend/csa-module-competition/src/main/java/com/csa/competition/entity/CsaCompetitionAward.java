package com.csa.competition.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("csa_competition_award")
public class CsaCompetitionAward {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long competitionId;

    private String awardLevel;

    private String memberNames;

    private String advisor;

    private String summary;

    private Integer isPublicDisplay;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
