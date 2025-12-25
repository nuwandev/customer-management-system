package com.nuwandev.cms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ErrorResponse {
    private String status;
    private String message;
    private Map<String, String> errors;

    public ErrorResponse(String status, String message, List<FieldError> fieldErrors) {
        this.status = status;
        this.message = message;
        this.errors = getErrorsMapFromList(fieldErrors);
    }

    public ErrorResponse(String status, String message) {
        this.status = status;
        this.message = message;
        this.errors = null;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    private Map<String, String> getErrorsMapFromList(List<FieldError> fieldErrorList) {
        Map<String, String> errors = new HashMap<>();
        fieldErrorList.forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
        return errors;
    }
}