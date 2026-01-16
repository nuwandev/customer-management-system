package com.nuwandev.cms.dto;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponseDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CustomerResponseDto(Customer customer) {
        this(customer.getId(), customer.getFirstName(), customer.getLastName(), customer.getEmail(), customer.getPhone(), customer.getStatus(), customer.getCreatedAt(), customer.getUpdatedAt());
    }
}
