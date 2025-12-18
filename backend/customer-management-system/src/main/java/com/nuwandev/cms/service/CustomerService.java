package com.nuwandev.cms.service;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.dto.CustomerRequestDto;
import com.nuwandev.cms.dto.CustomerResponseDto;

import java.util.List;

public interface CustomerService {

    List<CustomerResponseDto> getAllCustomers();

    CustomerResponseDto getCustomerById(String id);

    CustomerResponseDto createCustomer(CustomerRequestDto dto);

    CustomerResponseDto updateCustomer(String id, CustomerRequestDto dto);

    void deleteCustomer(String id);
}