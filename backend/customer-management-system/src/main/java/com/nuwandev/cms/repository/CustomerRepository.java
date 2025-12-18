package com.nuwandev.cms.repository;

import com.nuwandev.cms.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    Customer findByEmail(String email);
}