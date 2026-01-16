package com.nuwandev.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerPageResponseDto {
    List<CustomerResponseDto> content;
    Integer page;
    Integer size;
    Integer totalElements;
    Integer totalPages;
    Boolean isFirst;
    Boolean isLast;
}
