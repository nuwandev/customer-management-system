import { apiClient } from "./client";
import {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  CustomerPageResponse,
  CustomerListParams,
} from "../types/customer";

const CUSTOMERS_ENDPOINT = "/api/v1/customers";

export const customersApi = {
  /**
   * GET /api/v1/customers - List with pagination, sorting, search
   */
  getCustomers: async (
    params: CustomerListParams = {},
  ): Promise<CustomerPageResponse> => {
    const response = await apiClient.get<CustomerPageResponse>(
      CUSTOMERS_ENDPOINT,
      {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          sort: params.sort ?? "createdAt",
          order: params.order ?? "asc",
          search: params.search || undefined,
        },
      },
    );
    return response.data;
  },

  /**
   * GET /api/v1/customers/{id} - Get single customer
   */
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(
      `${CUSTOMERS_ENDPOINT}/${id}`,
    );
    return response.data;
  },

  /**
   * POST /api/v1/customers - Create customer
   */
  createCustomer: async (data: CustomerCreateRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>(CUSTOMERS_ENDPOINT, data);
    return response.data;
  },

  /**
   * PUT /api/v1/customers/{id} - Update customer
   */
  updateCustomer: async (
    id: string,
    data: CustomerUpdateRequest,
  ): Promise<Customer> => {
    const response = await apiClient.put<Customer>(
      `${CUSTOMERS_ENDPOINT}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/customers/{id} - Delete customer
   */
  deleteCustomer: async (id: string): Promise<void> => {
    await apiClient.delete(`${CUSTOMERS_ENDPOINT}/${id}`);
  },
};
