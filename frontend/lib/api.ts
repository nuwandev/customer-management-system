import { Customer } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network connection failed") {
    super(message);
    this.name = "NetworkError";
  }
}

// Error Utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof NetworkError) return error.message;
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}

// HTTP Client
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }
      throw new ApiError(errorMessage, response.status);
    }

    if (response.status === 204) return undefined as T;
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError(
        "Unable to connect to server. Please check if backend is running."
      );
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// Customer API
export const customerApi = {
  getAll(): Promise<Customer[]> {
    return fetchAPI<Customer[]>("/customers");
  },

  getById(id: string): Promise<Customer> {
    return fetchAPI<Customer>(`/customers/${id}`);
  },

  create(data: Omit<Customer, "id">): Promise<Customer> {
    return fetchAPI<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<Customer>): Promise<Customer> {
    return fetchAPI<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return fetchAPI<void>(`/customers/${id}`, { method: "DELETE" });
  },
};
