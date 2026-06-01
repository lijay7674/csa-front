package com.csa.common.enums;

public enum ContentStatus {
    DRAFT("草稿"),
    AI_DRAFT("AI初稿"),
    PENDING_REVIEW("待审核"),
    PUBLISHED("已发布"),
    OFFLINE("已下线");

    private final String label;

    ContentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}