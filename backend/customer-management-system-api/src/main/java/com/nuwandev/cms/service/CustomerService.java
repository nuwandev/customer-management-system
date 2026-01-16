package com.nuwandev.cms.service;

import com.nuwandev.cms.dto.CustomerCreateRequestDto;
import com.nuwandev.cms.dto.CustomerPageResponseDto;
import com.nuwandev.cms.dto.CustomerResponseDto;
import com.nuwandev.cms.dto.CustomerUpdateRequestDto;
import com.nuwandev.cms.enums.CustomerSortField;
import com.nuwandev.cms.enums.SortDirection;

public interface CustomerService {
    CustomerResponseDto getCustomerById(String id);

    CustomerResponseDto createCustomer(CustomerCreateRequestDto dto);

    CustomerResponseDto updateCustomer(String id, CustomerUpdateRequestDto dto);

    void deleteCustomer(String id);

    CustomerPageResponseDto getCustomers(Integer page, Integer size, CustomerSortField sort, SortDirection order, String search);
}