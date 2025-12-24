package com.nuwandev.cms.dto;

import com.nuwandev.cms.domain.Customer;
import jakarta.validation.constraints.NotBlank;

public class CustomerUpdateRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phone;

    private Customer.Status status;

    public CustomerUpdateRequestDto(String firstName, String lastName, String phone, Customer.Status status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.status = status;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setStatus(Customer.Status status) {
        this.status = status;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public Customer.Status getStatus() {
        return status;
    }
}
