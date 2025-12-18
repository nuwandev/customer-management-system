package com.nuwandev.cms.service;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.dto.CustomerRequestDto;
import com.nuwandev.cms.dto.CustomerResponseDto;
import com.nuwandev.cms.exception.CustomerAlreadyExistsException;
import com.nuwandev.cms.exception.CustomerNotFoundException;
import com.nuwandev.cms.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<CustomerResponseDto> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        List<CustomerResponseDto> dtos = new ArrayList<>();
        for (Customer c : customers) {
            dtos.add(new CustomerResponseDto(c));
        }
        return dtos;
    }

    @Override
    public CustomerResponseDto getCustomerById(String id) {
        Customer c = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        return new CustomerResponseDto(c);
    }

    @Override
    public CustomerResponseDto createCustomer(CustomerRequestDto dto) {
        Customer existing = customerRepository.findByEmail(dto.getEmail());
        if (existing != null) throw new CustomerAlreadyExistsException(dto.getEmail());

        Customer customer = new Customer(dto);
        Customer savedCustomer = customerRepository.save(customer);

        return new CustomerResponseDto(savedCustomer);
    }

    @Override
    public CustomerResponseDto updateCustomer(String id, CustomerRequestDto dto) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setPhone(dto.getPhone());
        customer.setStatus(dto.getStatus());
        Customer savedCustomer = customerRepository.save(customer);
        return new CustomerResponseDto(savedCustomer);
    }

    @Override
    public void deleteCustomer(String id) {
        customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        customerRepository.deleteById(id);
    }
}
