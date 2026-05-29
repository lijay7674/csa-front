package com.csa.common.enums;

public enum CompetitionStatus {
    REGISTERING("报名�?),
    REVIEWING("审核�?),
    CONFIRMED("已确�?),
    ONGOING("进行�?),
    ENDED("已结�?);

    private final String label;

    CompetitionStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
