// Core entity types
export interface Address {
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: Address | null;
  createdAt?: string;
  updatedAt?: string;
}

// Request DTOs
export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: Address | null;
}

export interface UpdateCustomerDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  address?: Partial<Address> | null;
}

// Response types
export type GetCustomersResponse = Customer[];
export type GetCustomerByIdResponse = Customer;
export type CreateCustomerResponse = Customer;
export type UpdateCustomerResponse = Customer;

// Error handling
export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ErrorResponse {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  errors?: FieldError[];
}
