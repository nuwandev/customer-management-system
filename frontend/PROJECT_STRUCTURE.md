# Project Structure & Architecture

## 📐 Architecture Overview

This project uses a **feature-based architecture** optimized for Next.js 16:

```
frontend/
├── app/                    # Next.js App Router (pages)
├── components/             # Shared UI components
├── features/               # Feature modules (self-contained)
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities, types, and helpers
```

## 🗂️ Detailed Structure

### `/app` - Next.js App Router

Next.js 16 pages and layouts.

```
app/
├── layout.tsx             # Root layout (<html>, <body>, metadata)
├── page.tsx               # Home page (customer management)
└── globals.css            # Global styles
```

**Key Points:**

- Uses Server Components by default
- `"use client"` directive for client components
- No `src/` folder (modern Next.js convention)

---

### `/components` - Shared UI Components

Reusable components used across features.

```
components/
├── SearchBar.tsx          # Search input with debouncing
├── Pagination.tsx         # Page navigation controls
└── ui/                    # UI component library
    ├── Button.tsx         # Button with variants (primary, secondary, danger)
    ├── Input.tsx          # Form input with label
    ├── Modal.tsx          # Modal dialog
    ├── Toast.tsx          # Notification toast
    ├── LoadingSpinner.tsx # Loading indicator
    └── EmptyState.tsx     # Empty state placeholder
```

**Design Principles:**

- Single responsibility
- Prop-based customization
- TypeScript interfaces with `Readonly<Props>`
- Default exports for UI components

---

### `/features` - Feature Modules

Self-contained feature modules with all related code.

```
features/
└── customers/
    ├── api.ts                 # Customer API calls
    ├── CustomerTable.tsx      # Customer list table
    ├── CustomerRow.tsx        # Individual customer row
    ├── CustomerForm.tsx       # Create/Edit form modal
    └── DeleteConfirmModal.tsx # Delete confirmation
```

**Feature Module Pattern:**

- All customer-related code in one folder
- API layer separated from UI
- Easy to test and maintain
- Can be extracted to a separate package

---

### `/hooks` - Custom React Hooks

Reusable React hooks for business logic.

```
hooks/
├── useCustomers.ts        # Customer data fetching & state
├── useDebounce.ts         # Input debouncing (search)
└── useToast.ts            # Toast notification management
```

**Hook Pattern:**

```typescript
export function useCustomers(onError: (message: string) => void) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
  }, []);

  return { customers, loading, setCustomers };
}
```

---

### `/lib` - Utilities & Types

Shared utilities, types, and helper functions.

```
lib/
├── types.ts               # TypeScript interfaces
├── apiClient.ts           # HTTP client with error handling
└── errorHandler.ts        # Error utilities
```

#### **types.ts** - TypeScript Interfaces

```typescript
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}
```

#### **apiClient.ts** - HTTP Client

```typescript
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T>;
```

**Features:**

- Generic type support
- Automatic error handling
- Network error detection
- JSON parsing

#### **errorHandler.ts** - Error Utilities

```typescript
export function getErrorMessage(error: unknown): string;
export function isNetworkError(error: unknown): boolean;
```

---

## 🔄 Data Flow

### 1. Page Component (`app/page.tsx`)

```
User Action → State Update → Re-render
```

### 2. API Call Flow

```
Component → Hook (useCustomers) → API (customerApi) → apiClient → Backend
```

### 3. Error Flow

```
Backend Error → apiClient catches → Hook catches → showToast → User sees error
```

---

## 🎯 Design Patterns

### 1. **Feature-Based Structure**

- Group by feature, not by type
- Each feature is self-contained
- Easy to locate and modify code

### 2. **Custom Hooks Pattern**

- Extract business logic from components
- Reusable across components
- Easier to test

### 3. **Compound Components**

- Modal + Button + Input work together
- Flexible composition
- Prop drilling avoided

### 4. **Error Boundary Pattern**

```typescript
try {
  await customerApi.delete(id);
  showToast("Success", "success");
} catch (error) {
  showToast(getErrorMessage(error), "error");
}
```

---

## 🧩 Component Composition

Example: Customer Form

```
<CustomerForm>          # Modal wrapper
  <Modal>              # Modal container
    <form>             # Form element
      <Input />        # Form fields
      <Input />
      <Button />       # Action buttons
      <Button />
    </form>
  </Modal>
</CustomerForm>
```

---

## 📦 Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

**Usage:**

```typescript
import { Customer } from "@/lib/types";
import Button from "@/components/ui/Button";
import { customerApi } from "@/features/customers/api";
```

**Benefits:**

- No relative path hell (`../../../`)
- Easy to refactor
- Cleaner imports

---

## 🏗️ Scalability

### Adding New Features

1. Create folder in `/features`:

   ```
   features/
   └── orders/
       ├── api.ts
       ├── OrderList.tsx
       └── OrderForm.tsx
   ```

2. Add hook if needed:

   ```
   hooks/
   └── useOrders.ts
   ```

3. Add types:
   ```typescript
   // lib/types.ts
   export interface Order { ... }
   ```

### Adding New Pages

1. Create in `/app`:

   ```
   app/
   └── orders/
       └── page.tsx
   ```

2. Use existing components and hooks

---

## ✅ Best Practices

1. **Keep components small** - Single responsibility
2. **Use TypeScript** - Full type coverage
3. **Extract business logic** - Use custom hooks
4. **Handle errors gracefully** - User-friendly messages
5. **Use readonly props** - `Readonly<Props>` for components
6. **Default exports for UI** - Named exports for utilities
7. **Co-locate related code** - Feature-based structure

---

## 🔍 Finding Code

| Want to find...          | Look in...                             |
| ------------------------ | -------------------------------------- |
| Customer table rendering | `features/customers/CustomerTable.tsx` |
| API calls                | `features/customers/api.ts`            |
| Data fetching logic      | `hooks/useCustomers.ts`                |
| UI components            | `components/ui/`                       |
| Type definitions         | `lib/types.ts`                         |
| Error handling           | `lib/errorHandler.ts`                  |
| HTTP client              | `lib/apiClient.ts`                     |

---

## 📖 Next Steps

1. Read [CODE_GUIDE.md](./CODE_GUIDE.md) for code walkthrough
2. Check component files for implementation details
3. Explore hooks to understand state management
4. Review API client for error handling patterns
