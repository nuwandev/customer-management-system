import {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  ErrorResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Query parameters for pagination and sorting (ready for backend implementation)
export interface QueryParams {
  page?: number; // 0-indexed page number for backend
  size?: number; // Number of items per page
  sort?: string; // Sort field and direction (e.g., "firstName,asc")
  search?: string; // Search query
}

// Paginated response from backend (when implemented)
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public error: string,
    public details?: ErrorResponse
  ) {
    super(details?.message || error);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetails: ErrorResponse | undefined;

    try {
      errorDetails = await response.json();
    } catch {
      // If JSON parsing fails, create a basic error
      errorDetails = {
        status: response.status,
        error: response.statusText,
        message: `Request failed with status ${response.status}`,
      };
    }

    throw new ApiError(response.status, response.statusText, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Build query string from params object
 */
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined)
    searchParams.set("page", params.page.toString());
  if (params.size !== undefined)
    searchParams.set("size", params.size.toString());
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.search) searchParams.set("search", params.search);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const customerApi = {
  // Get all customers (with optional pagination/sorting)
  // Currently returns all customers; when backend implements pagination,
  // it will return PagedResponse<Customer>
  async getAll(params?: QueryParams): Promise<Customer[]> {
    const queryString = params ? buildQueryString(params) : "";
    const response = await fetch(`${API_BASE_URL}/customers${queryString}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleResponse<Customer[]>(response);
    // Future: return handleResponse<PagedResponse<Customer>>(response);
  },

  // Get customer by ID
  async getById(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    return handleResponse<Customer>(response);
  },

  // Create new customer
  async create(data: CreateCustomerDTO): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Customer>(response);
  },

  // Update customer
  async update(id: number, data: UpdateCustomerDTO): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<Customer>(response);
  },

  // Delete customer
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    return handleResponse<void>(response);
  },
};

export { ApiError };
