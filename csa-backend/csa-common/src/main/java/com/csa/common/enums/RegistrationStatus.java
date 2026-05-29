package com.csa.common.enums;

public enum RegistrationStatus {
    PENDING("待审�?),
    APPROVED("已通过"),
    REJECTED("已拒�?),
    CANCELLED("已取�?),
    ENDED("已结�?);

    private final String label;

    RegistrationStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
