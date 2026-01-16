package com.nuwandev.cms.config;

import com.nuwandev.cms.enums.CustomerSortField;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class CustomerSortFieldConverter implements Converter<String, CustomerSortField> {
    @Override
    public CustomerSortField convert(String source) {
        if (source == null || source.isBlank()) {
            return CustomerSortField.CREATED_AT;
        }

        String normalized = source.trim().replace("_", "").toLowerCase();

        for (CustomerSortField field : CustomerSortField.values()) {
            String enumNormalized = field.getField().replace("_", "").toLowerCase();
            if (enumNormalized.equals(normalized)) {
                return field;
            }
        }

        throw new IllegalArgumentException("Unknown sort field: " + source);
    }
}
