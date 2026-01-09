# Production Refactor Plan: Simplification

## Executive Summary

**Current state:** 22 TypeScript files, 4 folder layers, 3 custom hooks, 2 API abstraction layers  
**Problem:** Over-abstracted for a single-page CRUD app with <1000 customers  
**Goal:** Reduce to ~12-15 files, inline unnecessary abstractions, maintain 100% functionality

**What we're NOT doing:** Rewriting, changing tech stack, removing features

---

## Analysis: What's Over-Engineered

### 1. **useCustomers Hook** ❌ Unnecessary Layer

**Current:** 35 lines wrapping `customerApi.getAll()` + useState  
**Problem:** Adds indirection for simple data fetching. Single use case.  
**Cost:** Debugging requires jumping between 3 files (page → hook → API)

**Before:**

```tsx
// hooks/useCustomers.ts (35 lines)
export function useCustomers(onError) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadCustomers = useCallback(async () => { ... }, []);
  useEffect(() => { loadCustomers() }, []);
  return { customers, loading, setCustomers };
}

// app/page.tsx
const { customers, loading, setCustomers } = useCustomers((msg) => showToast(msg, "error"));
```

**After:**

```tsx
// app/page.tsx - Direct data fetching
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  customerApi
    .getAll()
    .then(setCustomers)
    .catch((err) => showToast(getErrorMessage(err), "error"))
    .finally(() => setLoading(false));
}, []);
```

**Savings:** -35 lines, -1 file, -1 concept to learn  
**Trade-off:** Lose `reloadCustomers` function (can add back if needed, 3 lines)

---

### 2. **useDebounce Hook** ❌ Single-Use Generic

**Current:** 13-line hook imported once  
**Problem:** "Reusable" hook with 1 use case. Adds file navigation overhead.

**Before:**

```tsx
// hooks/useDebounce.ts (13 lines)
export function useDebounce<T>(value: T, delay: number): T { ... }

// app/page.tsx
const debouncedSearchQuery = useDebounce(searchQuery, 300);
```

**After:**

```tsx
// app/page.tsx - Inline 6 lines
const [searchQuery, setSearchQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

**Savings:** -13 lines, -1 file  
**Trade-off:** None (still 6 lines in page.tsx vs 1 import + 13 in separate file)

---

### 3. **SearchBar Component** ❌ Wrapper for Wrapper

**Current:** 22-line component wrapping `<Input>` with zero logic  
**Problem:** Just passes props through. Adds navigation step when debugging.

**Before:**

```tsx
// components/SearchBar.tsx (22 lines)
export function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// app/page.tsx
<SearchBar value={searchQuery} onChange={setSearchQuery} />;
```

**After:**

```tsx
// app/page.tsx - Direct Input usage
<Input
  type="text"
  placeholder="Search customers..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="mb-6"
/>
```

**Savings:** -22 lines, -1 file, -1 import  
**Trade-off:** None (same lines, more explicit)

---

### 4. **Pagination Component** ❌ Simple Logic Extracted

**Current:** 40-line component with 3 props, conditional rendering  
**Problem:** Simple prev/next buttons don't warrant separate file.

**Before:**

```tsx
// components/Pagination.tsx (40 lines)
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
```

**After:**

```tsx
// app/page.tsx - Inline pagination UI (12 lines)
{
  totalPages > 1 && (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        onClick={() => setCurrentPage((p) => p - 1)}
        disabled={currentPage === 1}
        variant="secondary"
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => setCurrentPage((p) => p + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
      >
        Next
      </Button>
    </div>
  );
}
```

**Savings:** -40 lines, -1 file  
**Trade-off:** `app/page.tsx` grows by 12 lines (still <220 total, acceptable)

---

### 5. **CustomerRow Component** ❌ Premature Extraction

**Current:** 53-line component for table row rendering  
**Problem:** Extracted for "reusability" but used exactly once, in one table. Makes table logic harder to follow.

**Before:**

```tsx
// features/customers/CustomerRow.tsx (53 lines)
export function CustomerRow({ customer, onEdit, onDelete }) {
  return <tr>...</tr>;
}

// features/customers/CustomerTable.tsx
<tbody>
  {customers.map((customer) => (
    <CustomerRow
      key={customer.id}
      customer={customer}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ))}
</tbody>;
```

**After:**

```tsx
// features/customers/CustomerTable.tsx - Inline row rendering
<tbody>
  {customers.map((customer) => (
    <tr key={customer.id} className="hover:bg-gray-50 border-b">
      <td>{customer.firstName}</td>
      <td>{customer.lastName}</td>
      <td>{customer.email}</td>
      <td>{customer.phone || "N/A"}</td>
      <td>{/* address */}</td>
      <td>
        <Button onClick={() => onEdit(customer)} variant="secondary" size="sm">
          Edit
        </Button>
        <Button onClick={() => onDelete(customer)} variant="danger" size="sm">
          Delete
        </Button>
      </td>
    </tr>
  ))}
</tbody>
```

**Savings:** -53 lines, -1 file  
**Trade-off:** Table component grows by ~20 lines (still <100 total, single concept)

---

### 6. **features/customers/ Folder** ❌ Over-Structure

**Current:** 5 files in `features/customers/` for single-feature app  
**Problem:** "Feature folder" pattern designed for apps with 5+ features. We have 1.

**Before:**

```
features/
  customers/
    api.ts
    CustomerTable.tsx
    CustomerRow.tsx
    CustomerForm.tsx
    DeleteConfirmModal.tsx
```

**After:**

```
components/
  CustomerTable.tsx      # includes inline row rendering
  CustomerForm.tsx
  DeleteConfirmModal.tsx
lib/
  api.ts                 # customer API functions
```

**Rationale:** Remove folder nesting that provides zero organizational benefit.

---

### 7. **apiClient + errorHandler Split** ⚠️ Questionable

**Current:** 2 files for error handling (61 + 15 lines)  
**Problem:** `errorHandler.ts` has 2 utility functions. Could merge into `apiClient.ts`.

**Before:**

```typescript
// lib/errorHandler.ts (15 lines)
export function getErrorMessage(error: unknown): string { ... }
export function isNetworkError(error: unknown): boolean { ... }

// lib/apiClient.ts (61 lines)
export class ApiError extends Error { ... }
export class NetworkError extends Error { ... }
export async function apiClient<T>(...) { ... }
```

**After:**

```typescript
// lib/api.ts (70 lines - merged)
export class ApiError extends Error { ... }
export class NetworkError extends Error { ... }

export function getErrorMessage(error: unknown): string { ... }
export function isNetworkError(error: unknown): boolean { ... }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> { ... }

// Customer API functions
export const customerApi = {
  getAll: () => fetchAPI<Customer[]>("/customers"),
  getById: (id: string) => fetchAPI<Customer>(`/customers/${id}`),
  create: (data: Omit<Customer, "id">) => fetchAPI<Customer>("/customers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Customer>) => fetchAPI<Customer>(`/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<void>(`/customers/${id}`, { method: "DELETE" }),
};
```

**Savings:** -1 file, -6 lines  
**Trade-off:** Single import point (`lib/api.ts` exports everything API-related)

---

## Refactor Plan: Step-by-Step

### Phase 1: Merge API Layer (Safe, No Behavior Change)

1. **Merge `lib/errorHandler.ts` → `lib/apiClient.ts`**

   - Move `getErrorMessage` and `isNetworkError` into apiClient
   - Update imports across 3 files (page.tsx, useCustomers, CustomerForm)

2. **Merge `features/customers/api.ts` → `lib/apiClient.ts`**

   - Consolidate all API code into single `lib/api.ts`
   - Rename `apiClient` → `fetchAPI` (internal function)
   - Export `customerApi` object directly

3. **Delete:**
   - `lib/errorHandler.ts`
   - `features/customers/api.ts`

**Result:** 2 files → 1 file (`lib/api.ts`)

---

### Phase 2: Inline Simple Components

4. **Remove `components/SearchBar.tsx`**

   - Replace `<SearchBar>` with `<Input>` in `app/page.tsx`
   - Delete file

5. **Remove `components/Pagination.tsx`**

   - Inline pagination JSX into `app/page.tsx`
   - Delete file

6. **Remove `features/customers/CustomerRow.tsx`**
   - Inline `<tr>` JSX into `CustomerTable.tsx`
   - Delete file

**Result:** 3 files deleted, page.tsx grows by ~25 lines (still <230 total)

---

### Phase 3: Inline Simple Hooks

7. **Remove `hooks/useDebounce.ts`**

   - Inline 6-line debounce logic into `app/page.tsx`
   - Delete file

8. **Remove `hooks/useCustomers.ts`**

   - Replace hook with direct `useEffect` + `customerApi.getAll()` in `app/page.tsx`
   - Delete file

9. **Keep `hooks/useToast.ts`** ✅
   - Used for toast queue management (legitimate state abstraction)
   - Clean interface, no simpler alternative

**Result:** 2 hooks deleted, page.tsx grows by ~15 lines (still <245 total)

---

### Phase 4: Flatten Folder Structure

10. **Move files out of `features/customers/`:**

    - `CustomerTable.tsx` → `components/CustomerTable.tsx`
    - `CustomerForm.tsx` → `components/CustomerForm.tsx`
    - `DeleteConfirmModal.tsx` → `components/DeleteConfirmModal.tsx`

11. **Delete empty folders:**
    - `features/customers/`
    - `features/`

**Result:** Flat structure, easier navigation

---

## Final File Structure

**Before (22 files):**

```
app/
  layout.tsx
  page.tsx (206 lines)
features/
  customers/
    api.ts
    CustomerTable.tsx
    CustomerRow.tsx
    CustomerForm.tsx
    DeleteConfirmModal.tsx
hooks/
  useCustomers.ts
  useDebounce.ts
  useToast.ts
components/
  SearchBar.tsx
  Pagination.tsx
  ui/ (6 files)
lib/
  types.ts
  apiClient.ts
  errorHandler.ts
```

**After (15 files):**

```
app/
  layout.tsx
  page.tsx (~245 lines - absorbed 3 inlined components + 2 hooks)
components/
  CustomerTable.tsx (~90 lines - absorbed CustomerRow)
  CustomerForm.tsx
  DeleteConfirmModal.tsx
  ui/ (6 files)
hooks/
  useToast.ts (kept - legitimate abstraction)
lib/
  types.ts
  api.ts (~100 lines - merged 3 files)
```

**Metrics:**

- **Files:** 22 → 15 (-32%)
- **Concepts:** 10 → 7 (-30%)
- **Imports in page.tsx:** 17 → 11 (-35%)
- **page.tsx size:** 206 → 245 lines (+19%, still maintainable)

---

## What We're NOT Changing

✅ **Keep:**

- All UI components in `components/ui/` (Button, Input, Modal, Toast, LoadingSpinner, EmptyState)
- `CustomerForm.tsx` and `DeleteConfirmModal.tsx` (complex components with state)
- `useToast` hook (manages toast queue, legitimate abstraction)
- `lib/types.ts` (shared types)
- TypeScript strict mode
- All functionality (CRUD, search, pagination, sorting, toasts)

❌ **Don't:**

- Change Next.js App Router
- Remove TypeScript
- Add new libraries
- Change UI/UX behavior
- Optimize for imaginary scale

---

## Implementation Order (Low Risk → High Risk)

### Wave 1: Safe Merges (Zero Behavior Change)

1. Merge `errorHandler.ts` → `apiClient.ts`
2. Merge `features/customers/api.ts` → `apiClient.ts`
3. Rename merged file to `lib/api.ts`

### Wave 2: Component Inlining (Isolated Changes)

4. Inline `SearchBar` → Direct `Input` in page.tsx
5. Inline `Pagination` → JSX in page.tsx
6. Inline `CustomerRow` → JSX in CustomerTable.tsx

### Wave 3: Hook Inlining (Requires Testing)

7. Inline `useDebounce` → useState + useEffect in page.tsx
8. Inline `useCustomers` → useEffect + customerApi in page.tsx

### Wave 4: Folder Cleanup

9. Move 3 files out of `features/customers/`
10. Delete empty folders

---

## Validation Checklist

After each wave, verify:

- [ ] `npm run build` succeeds (no TypeScript errors)
- [ ] `npm run dev` starts without errors
- [ ] Can view customer list
- [ ] Search filters correctly (with 300ms delay)
- [ ] Pagination works (prev/next buttons)
- [ ] Can create new customer
- [ ] Can edit existing customer
- [ ] Can delete customer (with confirmation)
- [ ] Toast notifications appear for success/error
- [ ] Loading spinner shows during API calls

---

## Example: Before/After Full Component

### app/page.tsx Comparison

**Before (206 lines, 17 imports):**

```tsx
import { useState, useMemo, useCallback } from "react";
import { Customer } from "@/lib/types";
import { customerApi } from "@/features/customers/api";
import { CustomerTable } from "@/features/customers/CustomerTable";
import { CustomerForm } from "@/features/customers/CustomerForm";
import { DeleteConfirmModal } from "@/features/customers/DeleteConfirmModal";
import { useCustomers } from "@/hooks/useCustomers";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorHandler";

export default function Home() {
  const { toasts, showToast, removeToast } = useToast();
  const { customers, loading, setCustomers } = useCustomers((msg) => showToast(msg, "error"));
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ... rest of component

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CustomerTable customers={paginatedCustomers} ... />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
```

**After (~245 lines, 11 imports):**

```tsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { Customer } from "@/lib/types";
import { customerApi, getErrorMessage } from "@/lib/api";
import { CustomerTable } from "@/components/CustomerTable";
import { CustomerForm } from "@/components/CustomerForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function Home() {
  const { toasts, showToast, removeToast } = useToast();

  // Data fetching (inlined useCustomers)
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi.getAll()
      .then(setCustomers)
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  // Search with debounce (inlined useDebounce)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ... rest of component logic (unchanged)

  return (
    <div>
      {/* Inlined SearchBar */}
      <Input
        type="text"
        placeholder="Search customers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6"
      />

      <CustomerTable customers={paginatedCustomers} ... />

      {/* Inlined Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} variant="secondary">
            Previous
          </Button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} variant="secondary">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
```

**Net change:**

- -6 imports (cleaner)
- +39 lines (206 → 245, still single-screen)
- -4 files in codebase
- Easier debugging (less file hopping)

---

## Risk Assessment

**Low Risk:**

- Merging API files (pure code movement)
- Inlining SearchBar/Pagination (simple JSX)
- Moving files out of `features/` (import path changes only)

**Medium Risk:**

- Inlining CustomerRow (table rendering change, test thoroughly)
- Inlining useDebounce (timing-sensitive, verify search delay)

**High Risk:**

- Inlining useCustomers (data fetching, verify loading states)

**Mitigation:**

- Implement in waves
- Test after each wave
- Git commit after each successful wave
- Keep wave 3 changes in separate PR for easier rollback

---

## Success Criteria

**Technical:**

- TypeScript compiles with zero errors
- All tests pass (if tests exist)
- Bundle size unchanged or smaller
- Dev server hot reload works

**Developer Experience:**

- Faster to locate code (fewer files to search)
- Fewer imports to manage
- Single file for data fetching (page.tsx or api.ts, not both + hook)
- New developer can understand flow in <30 minutes

**Maintenance:**

- Page component still <300 lines (acceptable for main orchestrator)
- Each remaining component has clear single purpose
- No "utility" files with 1-2 functions
- Folder structure matches actual usage patterns

---

## When NOT to Simplify (Future Scenarios)

**Add back abstraction when:**

1. **Second CRUD feature added** (e.g., Orders) → Revive `useResource` hook pattern
2. **Multiple pages need customer data** → Extract back to hook for sharing
3. **Search used in >2 places** → Reintroduce SearchBar component
4. **Complex error recovery logic** → Separate error handler with retry/fallback
5. **Backend pagination needed** → Paginate at API layer, not client-side

**Current state doesn't warrant these because:**

- Single feature (customers only)
- Single page (no data sharing)
- Simple error handling (toast + reload)
- Client-side pagination sufficient (<1000 records)

---

## Conclusion

This refactor removes **7 files** and **~150 lines** of indirection while preserving 100% functionality. The codebase becomes easier to navigate, debug, and understand—especially for mid-level engineers.

**Core principle:** Abstractions should be added when pain is felt, not predicted.
