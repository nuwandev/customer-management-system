package com.nuwandev.cms.enums;

public enum CustomerSortField {

    FIRST_NAME("firstName"),
    LAST_NAME("lastName"),
    EMAIL("email"),
    CREATED_AT("createdAt");

    private final String field;

    CustomerSortField(String field) {
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
