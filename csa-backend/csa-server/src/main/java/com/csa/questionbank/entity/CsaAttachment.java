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
@TableName("csa_attachment")
public class CsaAttachment {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long questionId;

    private String originalName;

    private String storedName;

    private String filePath;

    private Long fileSize;

    private String mimeType;

    private Integer downloadCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
