package com.csa.content.entity;

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
@TableName("csa_content")
public class CsaContent {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String category;

    private String summary;

    private String body;

    private String coverImage;

    private String source;

    private String status;

    private Integer isAiGenerated;

    private String reviewComment;

    private LocalDateTime publishedAt;

    private Long createdBy;

    private Long reviewedBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
