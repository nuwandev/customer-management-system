package com.nuwandev.cms.controller;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.dto.CustomerRequestDto;
import com.nuwandev.cms.dto.CustomerResponseDto;
import com.nuwandev.cms.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerResponseDto> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public CustomerResponseDto getCustomerById(@PathVariable String id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping
    public CustomerResponseDto createCustomer(@RequestBody @Valid CustomerRequestDto dto) {
        return customerService.createCustomer(dto);
    }

    @PutMapping("/{id}")
    public CustomerResponseDto updateCustomer(@PathVariable String id, @RequestBody @Valid CustomerRequestDto dto) {
        return customerService.updateCustomer(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
    }

}
