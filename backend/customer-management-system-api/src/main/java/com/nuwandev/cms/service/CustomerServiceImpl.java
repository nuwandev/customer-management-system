package com.nuwandev.cms.service;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.dto.CustomerCreateRequestDto;
import com.nuwandev.cms.dto.CustomerPageResponseDto;
import com.nuwandev.cms.dto.CustomerResponseDto;
import com.nuwandev.cms.dto.CustomerUpdateRequestDto;
import com.nuwandev.cms.enums.CustomerSortField;
import com.nuwandev.cms.enums.SortDirection;
import com.nuwandev.cms.exception.CustomerAlreadyExistsException;
import com.nuwandev.cms.exception.CustomerNotFoundException;
import com.nuwandev.cms.mapper.CustomerMapper;
import com.nuwandev.cms.repository.CustomerRepository;
import com.nuwandev.cms.specification.CustomerSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerResponseDto getCustomerById(String id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        return customerMapper.toDto(customer);
    }

    @Override
    public CustomerResponseDto createCustomer(CustomerCreateRequestDto dto) {
        Customer existing = customerRepository.findByEmail(dto.getEmail());
        if (existing != null) throw new CustomerAlreadyExistsException(dto.getEmail());

        Customer customer = customerMapper.toEntity(dto);
        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toDto(savedCustomer);
    }

    @Override
    public CustomerResponseDto updateCustomer(String id, CustomerUpdateRequestDto dto) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setPhone(dto.getPhone());
        customer.setStatus(dto.getStatus());
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDto(savedCustomer);
    }

    @Override
    public void deleteCustomer(String id) {
        customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        customerRepository.deleteById(id);
    }

    @Override
    public CustomerPageResponseDto getCustomers(Integer page, Integer size, CustomerSortField sort, SortDirection order, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(order.toSpringDirection(), sort.getField()));

        Page<Customer> customerPage;

        if (search != null && !search.isBlank()) {
            customerPage = customerRepository.findAll(CustomerSpecification.search(search), pageable);
        } else {
            customerPage = customerRepository.findAll(pageable);
        }

        List<CustomerResponseDto> content = customerMapper.toDtoList(customerPage.getContent());

        return new CustomerPageResponseDto(
                content,
                customerPage.getNumber(),
                customerPage.getSize(),
                (int) customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.isFirst(),
                customerPage.isLast()
        );
    }
}
