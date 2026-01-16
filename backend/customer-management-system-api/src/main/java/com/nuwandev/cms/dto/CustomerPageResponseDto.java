package com.nuwandev.cms.dto;

import lombok.*;

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
