package com.csa.common.enums;

public enum ContentCategory {
    ABOUT("学会简�?),
    NEWS("新闻"),
    NOTICE("公告"),
    TECH("资讯"),
    RECRUITMENT("招新"),
    OUTSTANDING_MEMBER("优秀成员"),
    COMPETITION_RESULT("竞赛成果");

    private final String label;

    ContentCategory(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
