package com.nuwandev.cms.mapper;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.dto.CustomerResponseDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    CustomerResponseDto toDto(Customer customer);

    List<CustomerResponseDto> toDtoList(List<Customer> customers);
}
