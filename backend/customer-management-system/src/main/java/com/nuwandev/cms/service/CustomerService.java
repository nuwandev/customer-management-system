package com.nuwandev.cms.service;

import com.nuwandev.cms.dto.CustomerCreateRequestDto;
import com.nuwandev.cms.dto.CustomerResponseDto;
import com.nuwandev.cms.dto.CustomerUpdateRequestDto;

import java.util.List;

public interface CustomerService {

    List<CustomerResponseDto> getAllCustomers();

    CustomerResponseDto getCustomerById(String id);

    CustomerResponseDto createCustomer(CustomerCreateRequestDto dto);

    CustomerResponseDto updateCustomer(String id, CustomerUpdateRequestDto dto);

    void deleteCustomer(String id);
}