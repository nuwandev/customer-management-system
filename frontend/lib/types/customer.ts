export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum SortField {
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
  EMAIL = "email",
  CREATED_AT = "createdAt",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: CustomerStatus;
}

export interface CustomerUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  status: CustomerStatus;
}

export interface CustomerPageResponse {
  content: Customer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface CustomerListParams {
  page?: number;
  size?: number;
  sort?: SortField;
  order?: SortOrder;
  search?: string;
}
