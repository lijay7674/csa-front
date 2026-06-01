package com.csa.common.enums;

public enum CompetitionStatus {
    REGISTERING("报名中"),
    REVIEWING("审核中"),
    CONFIRMED("已确认"),
    ONGOING("进行中"),
    ENDED("已结束");

    private final String label;

    CompetitionStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}