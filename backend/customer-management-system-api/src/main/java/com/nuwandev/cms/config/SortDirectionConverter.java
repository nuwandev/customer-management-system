package com.nuwandev.cms.config;

import com.nuwandev.cms.enums.SortDirection;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class SortDirectionConverter implements Converter<String, SortDirection> {
    @Override
    public SortDirection convert(String source) {
        if (source == null || source.isBlank()) {
            return SortDirection.ASC;
        }
        String normalized = source.trim().toUpperCase();
        for (SortDirection dir : SortDirection.values()) {
            if (dir.name().equalsIgnoreCase(normalized)) {
                return dir;
            }
        }
        throw new IllegalArgumentException("Unknown sort direction: " + source);
    }
}
