package com.csa.event.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("csa_event")
public class CsaEvent {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String eventType;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String location;

    private String contactPerson;

    private String description;

    private LocalDateTime regDeadline;

    private String status;

    private String summary;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
