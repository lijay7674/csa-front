-- ============================================================
-- CSA 官网系统 — 数据库建表脚本
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- 生成日期: 2026-05-29
-- ============================================================

CREATE DATABASE IF NOT EXISTS `csa_portal`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE `csa_portal`;

-- ============================================================
-- 1. 后台权限相关
-- ============================================================

-- 1.1 系统角色
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `role_name`   VARCHAR(32)  NOT NULL COMMENT '角色名称（展示用）',
    `role_code`   VARCHAR(32)  NOT NULL COMMENT '角色编码（权限判断用）',
    `permissions` JSON         NULL     COMMENT '模块权限列表 ["member:read","member:write","content:review",...]',
    `description` VARCHAR(255) NULL     COMMENT '角色说明',
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统角色';

-- 1.2 后台用户
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `username`   VARCHAR(32)  NOT NULL COMMENT '登录用户名',
    `password`   VARCHAR(128) NOT NULL COMMENT '加密密码（BCrypt）',
    `real_name`  VARCHAR(32)  NOT NULL COMMENT '真实姓名',
    `phone`      VARCHAR(20)  NULL     COMMENT '联系电话',
    `status`     TINYINT      NOT NULL DEFAULT 1 COMMENT '状态: 1=启用 0=禁用',
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台用户';

-- 1.3 用户-角色关联（N:M）
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `id`      BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户-角色关联';

-- ============================================================
-- 2. 成员与干部
-- ============================================================

-- 2.1 成员档案
DROP TABLE IF EXISTS `csa_member`;
CREATE TABLE `csa_member` (
    `id`             BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `name`           VARCHAR(32)  NOT NULL COMMENT '姓名',
    `gender`         TINYINT      NULL     COMMENT '性别: 0=女 1=男',
    `cohort`         VARCHAR(10)  NOT NULL COMMENT '届别，如 2024',
    `major`          VARCHAR(64)  NULL     COMMENT '专业',
    `class_name`     VARCHAR(32)  NULL     COMMENT '班级',
    `student_id`     VARCHAR(32)  NULL     COMMENT '学号',
    `phone`          VARCHAR(20)  NULL     COMMENT '手机号（仅后台可见）',
    `tech_direction` VARCHAR(64)  NULL     COMMENT '技术方向，如 Java/前端/AI',
    `join_date`      DATE         NULL     COMMENT '加入时间',
    `status`         VARCHAR(16)  NOT NULL DEFAULT '在会' COMMENT '状态: 在会/干部/已毕业/已退出/历史归档',
    `remark`         VARCHAR(512) NULL     COMMENT '备注',
    `is_public_display` TINYINT   NOT NULL DEFAULT 0 COMMENT '是否在前台优秀成员展示: 0=否 1=是',
    `display_title`  VARCHAR(64)  NULL     COMMENT '前台展示用称号',
    `display_achievement` VARCHAR(512) NULL COMMENT '前台展示用代表成果',
    `display_summary` VARCHAR(512) NULL    COMMENT '前台展示用获奖摘要',
    `avatar_url`     VARCHAR(255) NULL     COMMENT '头像URL',
    `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_cohort` (`cohort`),
    KEY `idx_status` (`status`),
    KEY `idx_public_display` (`is_public_display`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成员档案';

-- 2.2 干部任职
DROP TABLE IF EXISTS `csa_cadre`;
CREATE TABLE `csa_cadre` (
    `id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `member_id`  BIGINT       NOT NULL COMMENT '成员ID',
    `cohort`     VARCHAR(10)  NOT NULL COMMENT '任职届别',
    `department` VARCHAR(32)  NOT NULL COMMENT '部门',
    `position`   VARCHAR(32)  NOT NULL COMMENT '职务',
    `start_date` DATE         NOT NULL COMMENT '任职开始日期',
    `end_date`   DATE         NULL     COMMENT '任职结束日期',
    `remark`     VARCHAR(255) NULL     COMMENT '备注',
    `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_member_id` (`member_id`),
    KEY `idx_cohort` (`cohort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='干部任职记录';

-- ============================================================
-- 3. 活动
-- ============================================================

DROP TABLE IF EXISTS `csa_event`;
CREATE TABLE `csa_event` (
    `id`             BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    `title`          VARCHAR(128)  NOT NULL COMMENT '活动名称',
    `event_type`     VARCHAR(32)   NOT NULL COMMENT '活动类型: 讲座/比赛/培训/团建/其他',
    `start_time`     DATETIME      NOT NULL COMMENT '开始时间',
    `end_time`       DATETIME      NULL     COMMENT '结束时间',
    `location`       VARCHAR(128)  NULL     COMMENT '地点',
    `contact_person` VARCHAR(32)   NULL     COMMENT '负责人',
    `description`    TEXT          NULL     COMMENT '活动简介',
    `reg_deadline`   DATETIME      NULL     COMMENT '报名截止时间',
    `status`         VARCHAR(16)   NOT NULL DEFAULT '筹备中' COMMENT '活动状态: 筹备中/报名中/进行中/已结束',
    `summary`        TEXT          NULL     COMMENT '活动总结（活动结束后填写）',
    `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_event_type` (`event_type`),
    KEY `idx_status` (`status`),
    KEY `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动信息';

-- ============================================================
-- 4. 竞赛
-- ============================================================

-- 4.1 竞赛信息
DROP TABLE IF EXISTS `csa_competition`;
CREATE TABLE `csa_competition` (
    `id`           BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `name`         VARCHAR(128) NOT NULL COMMENT '竞赛名称',
    `level`        VARCHAR(16)  NOT NULL COMMENT '竞赛级别: 校级/省级/国家级/国际级',
    `comp_type`    VARCHAR(32)  NOT NULL COMMENT '竞赛类型: 编程/算法/项目/创新创业/其他',
    `year`         INT          NOT NULL COMMENT '年份',
    `organizer`    VARCHAR(128) NULL     COMMENT '主办方',
    `reg_method`   VARCHAR(16)  NOT NULL DEFAULT '个人' COMMENT '报名方式: 个人/团队/两者均可',
    `reg_deadline` DATETIME     NULL     COMMENT '报名截止时间',
    `status`       VARCHAR(16)  NOT NULL DEFAULT '报名中' COMMENT '状态: 报名中/审核中/已确认/进行中/已结束',
    `description`  TEXT         NULL     COMMENT '竞赛简介',
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_year` (`year`),
    KEY `idx_level` (`level`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='竞赛信息';

-- 4.2 竞赛获奖
DROP TABLE IF EXISTS `csa_competition_award`;
CREATE TABLE `csa_competition_award` (
    `id`               BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `competition_id`   BIGINT       NOT NULL COMMENT '竞赛ID',
    `award_level`      VARCHAR(32)  NOT NULL COMMENT '获奖等级: 特等奖/一等奖/二等奖/三等奖/优秀奖',
    `member_names`     JSON         NOT NULL COMMENT '获奖成员姓名列表 ["张三","李四"]',
    `advisor`          VARCHAR(32)  NULL     COMMENT '指导老师',
    `summary`          VARCHAR(512) NULL     COMMENT '成果简介',
    `is_public_display` TINYINT     NOT NULL DEFAULT 1 COMMENT '是否在前台展示: 0=否 1=是',
    `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_competition_id` (`competition_id`),
    KEY `idx_award_level` (`award_level`),
    KEY `idx_public_display` (`is_public_display`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='竞赛获奖记录';

-- ============================================================
-- 5. 统一报名记录
-- ============================================================

DROP TABLE IF EXISTS `csa_registration`;
CREATE TABLE `csa_registration` (
    `id`             BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `reg_no`         VARCHAR(32)  NOT NULL COMMENT '报名编号（前台查询凭证）',
    `target_type`    VARCHAR(16)  NOT NULL COMMENT '报名类型: 招新/活动/竞赛',
    `target_id`      BIGINT       NOT NULL COMMENT '目标ID（活动ID/竞赛ID/固定招新ID）',
    `reg_type`       VARCHAR(8)   NOT NULL DEFAULT '个人' COMMENT '个人/团队',
    `name`           VARCHAR(32)  NOT NULL COMMENT '报名人姓名',
    `student_id`     VARCHAR(32)  NOT NULL COMMENT '学号',
    `phone`          VARCHAR(20)  NOT NULL COMMENT '手机号',
    `team_name`      VARCHAR(64)  NULL     COMMENT '团队名称（团队报名时填写）',
    `team_members`   JSON         NULL     COMMENT '团队成员 [{"name":"张三","studentId":"2024001"},...]',
    `extra_info`     JSON         NULL     COMMENT '扩展字段（不同报名类型附加信息）',
    `submit_time`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    `status`         VARCHAR(16)  NOT NULL DEFAULT '待审核' COMMENT '审核状态: 待审核/已通过/已拒绝/已取消/已结束',
    `review_comment` VARCHAR(255) NULL     COMMENT '审核意见',
    `contact_record` JSON         NULL     COMMENT '联系记录 [{"time":"...","method":"电话","note":"..."}]',
    `reviewed_at`    DATETIME     NULL     COMMENT '审核时间',
    `reviewed_by`    BIGINT       NULL     COMMENT '审核人ID',
    `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_reg_no` (`reg_no`),
    KEY `idx_target` (`target_type`, `target_id`),
    KEY `idx_status` (`status`),
    KEY `idx_phone` (`phone`),
    KEY `idx_student_id` (`student_id`),
    -- 去重约束在业务层处理（根据报名类型不同策略不同），不在表级别加硬约束
    KEY `idx_submit_time` (`submit_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统一报名记录';

-- ============================================================
-- 6. 内容管理
-- ============================================================

DROP TABLE IF EXISTS `csa_content`;
CREATE TABLE `csa_content` (
    `id`               BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    `title`            VARCHAR(128)  NOT NULL COMMENT '标题',
    `category`         VARCHAR(16)   NOT NULL COMMENT '栏目类型: 学会简介/新闻/公告/资讯/招新/优秀成员/竞赛成果',
    `summary`          VARCHAR(512)  NULL     COMMENT '摘要',
    `body`             MEDIUMTEXT    NULL     COMMENT '正文（富文本HTML，已做XSS清洗）',
    `cover_image`      VARCHAR(255)  NULL     COMMENT '封面图URL',
    `source`           VARCHAR(64)   NULL     COMMENT '来源',
    `status`           VARCHAR(16)   NOT NULL DEFAULT '草稿' COMMENT '状态: 草稿/AI初稿/待审核/已发布/已下线',
    `is_ai_generated`  TINYINT       NOT NULL DEFAULT 0 COMMENT '是否AI生成初稿: 0=否 1=是',
    `review_comment`   VARCHAR(255)  NULL     COMMENT '审核意见',
    `published_at`     DATETIME      NULL     COMMENT '发布时间',
    `created_by`       BIGINT        NOT NULL COMMENT '创建人ID（sys_user.id）',
    `reviewed_by`      BIGINT        NULL     COMMENT '审核人ID',
    `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`),
    KEY `idx_published_at` (`published_at`),
    KEY `idx_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容信息';

-- ============================================================
-- 7. 题库与附件
-- ============================================================

-- 7.1 题库
DROP TABLE IF EXISTS `csa_question_bank`;
CREATE TABLE `csa_question_bank` (
    `id`             BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    `title`          VARCHAR(128)  NOT NULL COMMENT '题目标题',
    `year`           INT           NOT NULL COMMENT '年份',
    `category`       VARCHAR(32)   NOT NULL COMMENT '分类: 编程/算法/数据结构/数学/其他',
    `source`         VARCHAR(64)   NULL     COMMENT '来源说明',
    `description`    TEXT          NULL     COMMENT '内容简介',
    `copyright_note` VARCHAR(255)  NULL     COMMENT '版权说明',
    `is_public`      TINYINT       NOT NULL DEFAULT 1 COMMENT '是否公开: 0=否 1=是',
    `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_year` (`year`),
    KEY `idx_category` (`category`),
    KEY `idx_is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题库题目';

-- 7.2 附件文件
DROP TABLE IF EXISTS `csa_attachment`;
CREATE TABLE `csa_attachment` (
    `id`              BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键',
    `question_id`     BIGINT        NOT NULL COMMENT '关联题目ID',
    `original_name`   VARCHAR(255)  NOT NULL COMMENT '原始文件名',
    `stored_name`     VARCHAR(128)  NOT NULL COMMENT '存储文件名（UUID）',
    `file_path`       VARCHAR(512)  NOT NULL COMMENT '存储路径',
    `file_size`       BIGINT        NOT NULL COMMENT '文件大小（字节）',
    `mime_type`       VARCHAR(64)   NULL     COMMENT 'MIME类型',
    `download_count`  INT           NOT NULL DEFAULT 0 COMMENT '下载次数',
    `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件文件';

-- ============================================================
-- 8. 外键约束（可选 — 根据实际需要决定是否启用）
-- ============================================================
-- ALTER TABLE `csa_cadre`             ADD CONSTRAINT `fk_cadre_member`             FOREIGN KEY (`member_id`)      REFERENCES `csa_member` (`id`)          ON DELETE CASCADE;
-- ALTER TABLE `csa_competition_award` ADD CONSTRAINT `fk_award_competition`        FOREIGN KEY (`competition_id`)  REFERENCES `csa_competition` (`id`)    ON DELETE CASCADE;
-- ALTER TABLE `csa_attachment`        ADD CONSTRAINT `fk_attachment_question_bank` FOREIGN KEY (`question_id`)     REFERENCES `csa_question_bank` (`id`)   ON DELETE CASCADE;
-- ALTER TABLE `sys_user_role`         ADD CONSTRAINT `fk_ur_user`                  FOREIGN KEY (`user_id`)        REFERENCES `sys_user` (`id`)            ON DELETE CASCADE;
-- ALTER TABLE `sys_user_role`         ADD CONSTRAINT `fk_ur_role`                  FOREIGN KEY (`role_id`)        REFERENCES `sys_role` (`id`)            ON DELETE CASCADE;

-- ============================================================
-- 9. 初始数据
-- ============================================================

-- 9.1 默认角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `permissions`, `description`) VALUES
(1, '超级管理员', 'SUPER_ADMIN',
 '["member:read","member:write","cadre:read","cadre:write","event:read","event:write","competition:read","competition:write","registration:read","registration:write","content:read","content:write","content:review","question-bank:read","question-bank:write","ai:use","user:manage","role:manage","stats:read"]',
 '拥有全部权限'),
(2, '内容编辑', 'CONTENT_EDITOR',
 '["content:read","content:write","ai:use","question-bank:read","question-bank:write","stats:read"]',
 '负责新闻、公告、资讯、招新内容的撰写和AI辅助'),
(3, '内容审核员', 'CONTENT_REVIEWER',
 '["content:read","content:review","question-bank:read","stats:read"]',
 '负责内容审核发布'),
(4, '活动管理员', 'EVENT_MANAGER',
 '["event:read","event:write","registration:read","registration:write","stats:read"]',
 '负责活动和报名管理'),
(5, '竞赛管理员', 'COMPETITION_MANAGER',
 '["competition:read","competition:write","registration:read","registration:write","stats:read"]',
 '负责竞赛和报名管理'),
(6, '成员管理员', 'MEMBER_MANAGER',
 '["member:read","member:write","cadre:read","cadre:write","stats:read"]',
 '负责成员档案与干部任职管理');

-- 9.2 默认管理员账号 (密码: admin123，BCrypt加密)
INSERT INTO `sys_user` (`id`, `username`, `password`, `real_name`, `status`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5Eh', '系统管理员', 1);

INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);
