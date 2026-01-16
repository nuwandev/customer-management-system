package com.nuwandev.cms.enums;

import org.springframework.data.domain.Sort;

public enum SortDirection {
    ASC, DESC;

    public Sort.Direction toSpringDirection() {
        return this == DESC
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
    }
}
