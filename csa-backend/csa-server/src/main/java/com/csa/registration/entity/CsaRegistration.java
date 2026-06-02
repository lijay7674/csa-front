package com.csa.registration.entity;

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
@TableName("csa_registration")
public class CsaRegistration {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String regNo;

    private String targetType;

    private Long targetId;

    private String regType;

    private String name;

    private String studentId;

    private String phone;

    private String teamName;

    private String teamMembers;

    private String extraInfo;

    private LocalDateTime submitTime;

    private String status;

    private String reviewComment;

    private String contactRecord;

    private LocalDateTime reviewedAt;

    private Long reviewedBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
