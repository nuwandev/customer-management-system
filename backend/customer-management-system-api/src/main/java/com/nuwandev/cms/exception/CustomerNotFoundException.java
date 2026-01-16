package com.nuwandev.cms.exception;

public class CustomerNotFoundException extends RuntimeException {
    public CustomerNotFoundException(String id) {
        super("Customer with id " + id + " not found");
    }
}
