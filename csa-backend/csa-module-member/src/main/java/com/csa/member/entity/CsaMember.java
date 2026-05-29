package com.csa.member.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("csa_member")
public class CsaMember {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Integer gender;

    private String cohort;

    private String major;

    private String className;

    private String studentId;

    private String phone;

    private String techDirection;

    private LocalDate joinDate;

    private String status;

    private String remark;

    private Integer isPublicDisplay;

    private String displayTitle;

    private String displayAchievement;

    private String displaySummary;

    private String avatarUrl;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
