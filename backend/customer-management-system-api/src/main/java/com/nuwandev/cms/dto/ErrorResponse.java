package com.nuwandev.cms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@AllArgsConstructor
@NoArgsConstructor(force = true)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ErrorResponse {

    private final String status;
    private final String message;
    private final Map<String, String> errors;

    public ErrorResponse(String status, String message) {
        this(status, message, null);
    }
}
