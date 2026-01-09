# Code Guide - How Everything Works

A complete walkthrough of the codebase to help you understand how all the pieces fit together.

## 📚 Table of Contents

1. [Page Component - The Heart](#1-page-component---the-heart)
2. [Customer Feature - CRUD Operations](#2-customer-feature---crud-operations)
3. [UI Components - Building Blocks](#3-ui-components---building-blocks)
4. [Custom Hooks - State Management](#4-custom-hooks---state-management)
5. [API Layer - Backend Communication](#5-api-layer---backend-communication)
6. [Type System - Type Safety](#6-type-system---type-safety)
7. [Error Handling - User Feedback](#7-error-handling---user-feedback)

---

## 1. Page Component - The Heart

**File:** `app/page.tsx`

This is the main component that orchestrates everything.

### What It Does

```typescript
export default function Home() {
  // 1. Setup toast notifications
  const { toasts, showToast, removeToast } = useToast();

  // 2. Load customers from API
  const { customers, loading, setCustomers } = useCustomers((msg) =>
    showToast(msg, "error")
  );

  // 3. Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 4. UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );

  // 5. Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Customer>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ... filtering, sorting, pagination logic
}
```

### User Journey

1. **Page loads** → `useCustomers` fetches data → Shows loading spinner
2. **Data arrives** → Displays customer table
3. **User searches** → `useDebounce` delays → Filter customers → Update display
4. **User clicks "Add"** → Opens modal → User fills form → Submit → API call → Update list
5. **User clicks "Edit"** → Opens modal with data → User edits → Submit → API call → Update list
6. **User clicks "Delete"** → Shows confirmation → User confirms → API call → Remove from list
7. **Errors occur** → `showToast` displays error message

---

## 2. Customer Feature - CRUD Operations

### File: `features/customers/api.ts`

API client for customer operations.

```typescript
export const customerApi = {
  // GET /api/customers
  async getAll(): Promise<Customer[]> {
    return apiClient<Customer[]>("/customers", { method: "GET" });
  },

  // POST /api/customers
  async create(data: Omit<Customer, "id">): Promise<Customer> {
    return apiClient<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT /api/customers/:id
  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    return apiClient<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/customers/:id
  async delete(id: string): Promise<void> {
    return apiClient<void>(`/customers/${id}`, { method: "DELETE" });
  },
};
```

### File: `features/customers/CustomerTable.tsx`

Renders the customer list.

```typescript
export function CustomerTable({
  customers,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: Readonly<CustomerTableProps>) {
  // Show empty state if no customers
  if (customers.length === 0) {
    return <EmptyState title="No customers found" />;
  }

  // Render table with sortable headers
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => onSort("firstName")}>
            First Name {getSortIcon("firstName")}
          </th>
          {/* More headers... */}
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <CustomerRow
            key={customer.id}
            customer={customer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
```

### File: `features/customers/CustomerForm.tsx`

Modal form for creating/editing customers.

```typescript
export function CustomerForm({
  customer,
  isOpen,
  onClose,
  onSave,
}: Readonly<CustomerFormProps>) {
  // Form state
  const [formData, setFormData] = useState<Omit<Customer, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: { ... },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (customer) {
      setFormData({ ... });
    }
  }, [customer]);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customer ? { ...customer, ...formData } : formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="...">
      <form onSubmit={handleSubmit}>
        <Input value={formData.firstName} onChange={...} />
        {/* More fields... */}
        <Button type="submit">Save</Button>
      </form>
    </Modal>
  );
}
```

### File: `features/customers/DeleteConfirmModal.tsx`

Confirmation dialog for deletions.

```typescript
export function DeleteConfirmModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
}: Readonly<DeleteConfirmModalProps>) {
  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p>
        Are you sure you want to delete {customer.firstName} {customer.lastName}
        ?
      </p>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </Modal>
  );
}
```

---

## 3. UI Components - Building Blocks

### File: `components/ui/Button.tsx`

Reusable button with variants.

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${sizeStyles[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

**Usage:**

```tsx
<Button onClick={handleClick}>Click Me</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button variant="secondary" isLoading={loading}>Save</Button>
```

### File: `components/ui/Input.tsx`

Form input with label.

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

**Usage:**

```tsx
<Input label="Email" type="email" value={email} onChange={...} />
<Input label="Name" error="Required" value={name} onChange={...} />
```

### File: `components/ui/Modal.tsx`

Modal dialog with backdrop.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
```

### File: `components/ui/Toast.tsx`

Notification toast that auto-dismisses.

```typescript
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}
```

---

## 4. Custom Hooks - State Management

### File: `hooks/useCustomers.ts`

Manages customer data fetching and state.

```typescript
export function useCustomers(onError: (message: string) => void) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(err as Error);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    loading,
    error,
    setCustomers,
    reloadCustomers: loadCustomers,
  };
}
```

**Usage:**

```typescript
const { customers, loading, setCustomers } = useCustomers((msg) =>
  showToast(msg, "error")
);
```

### File: `hooks/useDebounce.ts`

Delays value updates (for search).

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

**Usage:**

```typescript
const [searchQuery, setSearchQuery] = useState("");
const debouncedQuery = useDebounce(searchQuery, 300);
// debouncedQuery updates 300ms after user stops typing
```

### File: `hooks/useToast.ts`

Manages toast notifications.

```typescript
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
```

**Usage:**

```typescript
const { toasts, showToast, removeToast } = useToast();

// Show success
showToast("Customer created!", "success");

// Show error
showToast("Failed to save", "error");

// Render toasts
{
  toasts.map((toast) => (
    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
  ));
}
```

---

## 5. API Layer - Backend Communication

### File: `lib/apiClient.ts`

HTTP client with error handling.

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
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

export async function apiClient<T>(
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
      throw new ApiError(`HTTP ${response.status}`, response.status);
    }

    if (response.status === 204) return undefined as T;
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError("Unable to connect to server");
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
```

**How It Works:**

1. Builds full URL: `http://localhost:8080/api` + `/customers`
2. Sets JSON headers automatically
3. Handles HTTP errors (4xx, 5xx)
4. Detects network failures (backend down)
5. Returns typed response

---

## 6. Type System - Type Safety

### File: `lib/types.ts`

TypeScript interfaces for type safety.

```typescript
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}
```

**Benefits:**

- Auto-completion in IDE
- Catch errors at compile time
- Self-documenting code
- Refactoring safety

---

## 7. Error Handling - User Feedback

### File: `lib/errorHandler.ts`

Error utilities for user-friendly messages.

```typescript
export function getErrorMessage(error: unknown): string {
  if (error instanceof NetworkError) return error.message;
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}
```

**Error Flow:**

```
1. API call fails
   ↓
2. apiClient catches error
   ↓
3. Throws ApiError or NetworkError
   ↓
4. Hook catches error
   ↓
5. Calls onError callback
   ↓
6. Page shows toast notification
   ↓
7. User sees friendly message
```

**Example:**

```typescript
try {
  await customerApi.create(data);
  showToast("Customer created!", "success");
} catch (error) {
  showToast(getErrorMessage(error), "error");
  // User sees: "Unable to connect to server" (if backend down)
  // Or: "HTTP 400: Invalid email" (if validation error)
}
```

---

## 🔄 Complete User Flow Example

**Scenario: User creates a new customer**

1. **User clicks "Add Customer"**

   ```typescript
   handleCreate() → setIsFormOpen(true)
   ```

2. **Modal opens**

   ```typescript
   <CustomerForm isOpen={true} customer={null} />
   ```

3. **User fills form and submits**

   ```typescript
   handleSubmit() → onSave(formData)
   ```

4. **Page handler processes**

   ```typescript
   handleFormSubmit(data) → customerApi.create(data)
   ```

5. **API client makes request**

   ```typescript
   apiClient("/customers", { method: "POST", body: JSON.stringify(data) });
   ```

6. **Backend responds with new customer**

   ```typescript
   { id: 123, firstName: "John", ... }
   ```

7. **Update state**

   ```typescript
   setCustomers((prev) => [...prev, created]);
   ```

8. **Show success toast**

   ```typescript
   showToast("Customer created!", "success");
   ```

9. **Close modal**

   ```typescript
   setIsFormOpen(false);
   ```

10. **User sees updated table with new customer**

---

## 🎯 Key Takeaways

1. **Page orchestrates everything** - Manages state, calls hooks, renders UI
2. **Features are self-contained** - Customer feature has all customer logic
3. **Hooks handle side effects** - Data fetching, debouncing, toasts
4. **Components are reusable** - Button, Input, Modal work anywhere
5. **API layer abstracts backend** - Components don't know about fetch
6. **Errors are user-friendly** - Technical errors → Simple messages
7. **TypeScript ensures safety** - Catch bugs before runtime

---

## 📖 Next Steps

1. Open `app/page.tsx` and follow the code
2. Try creating a customer and watch the flow
3. Add console.logs to trace execution
4. Modify a component and see changes
5. Add a new field to Customer type
6. Create your own custom hook

Happy coding! 🚀
