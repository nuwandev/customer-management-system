package com.nuwandev.cms.specification;

import com.nuwandev.cms.domain.Customer;
import org.springframework.data.jpa.domain.Specification;

public class CustomerSpecification {

    public static Specification<Customer> search(String query) {
        return (root, cq, cb) -> {
            String pattern = "%" + query.toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), pattern),
                    cb.like(cb.lower(root.get("lastName")), pattern),
                    cb.like(cb.lower(root.get("email")), pattern),
                    cb.like(cb.lower(root.get("phone")), pattern)
            );
        };
    }
}
