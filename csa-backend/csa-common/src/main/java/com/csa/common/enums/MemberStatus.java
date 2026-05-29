package com.csa.common.enums;

public enum MemberStatus {
    ACTIVE("在会"),
    CADRE("干部"),
    GRADUATED("已毕�?),
    LEFT("已退�?),
    ARCHIVED("历史归档");

    private final String label;

    MemberStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
