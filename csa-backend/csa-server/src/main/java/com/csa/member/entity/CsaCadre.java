package com.csa.member.entity;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("csa_cadre")
public class CsaCadre {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long memberId;

    private String cohort;

    private String department;

    private String position;

    private LocalDate startDate;

    private LocalDate endDate;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
