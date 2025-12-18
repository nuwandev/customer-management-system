package com.nuwandev.cms.service;

import com.nuwandev.cms.domain.Customer;
import com.nuwandev.cms.exception.CustomerAlreadyExistsException;
import com.nuwandev.cms.exception.CustomerNotFoundException;
import com.nuwandev.cms.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(String id) {
        return customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
    }

    @Override
    public Customer createCustomer(Customer customer) {
        Customer existing = customerRepository.findByEmail(customer.getEmail());
        if (existing != null) throw new CustomerAlreadyExistsException("Customer already exists");
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(String id, Customer customer) {
        Customer existing = getCustomerById(id);
        existing.setFirstName(customer.getFirstName());
        existing.setLastName(customer.getLastName());
        existing.setPhone(customer.getPhone());
        existing.setStatus(customer.getStatus());
        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(String id) {
        Customer existing = getCustomerById(id);
        customerRepository.deleteById(id);
    }
}
