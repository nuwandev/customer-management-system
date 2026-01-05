"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Customer } from "@/lib/types";
import { customerApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToastContainer } from "@/components/ui/Toast";
import { CustomerForm } from "@/components/CustomerForm";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useDebounce } from "@/lib/hooks/useDebounce";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type SortField = "name" | "email" | "phone" | "location";
type SortDirection = "asc" | "desc";

// Memoized table row component to prevent unnecessary re-renders
const CustomerRow = React.memo(
  ({
    customer,
    onEdit,
    onDelete,
  }: {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
  }) => (
    <tr className="hover:bg-blue-50/50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {customer.firstName[0]}
              {customer.lastName[0]}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{customer.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{customer.phone || "—"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {customer.address
            ? `${customer.address.city}, ${customer.address.country}`
            : "—"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(customer)}
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(customer)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  )
);

CustomerRow.displayName = "CustomerRow";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Debounce search query to reduce filtering operations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch {
      showToast("Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let result = customers;

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "phone":
          aValue = (a.phone || "").toLowerCase();
          bValue = (b.phone || "").toLowerCase();
          break;
        case "location":
          aValue = a.address
            ? `${a.address.city}, ${a.address.country}`.toLowerCase()
            : "";
          bValue = b.address
            ? `${b.address.city}, ${b.address.country}`.toLowerCase()
            : "";
          break;
      }

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return result;
  }, [customers, debouncedSearchQuery, sortField, sortDirection]);

  // Paginate customers
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedCustomers.slice(startIndex, endIndex);
  }, [filteredAndSortedCustomers, currentPage, pageSize]);

  // Reset to page 1 when search query or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, pageSize]);

  const showToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handleCreate = useCallback(() => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((customer: Customer) => {
    setDeletingCustomer(customer);
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // New field, default to ascending
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value));
    },
    []
  );

  const handleDeleteConfirm = async () => {
    if (!deletingCustomer) return;

    try {
      await customerApi.delete(deletingCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      showToast("Customer deleted successfully", "success");
      setDeletingCustomer(null);
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Failed to delete customer", "error");
      }
    }
  };

  const handleFormSubmit = async (data: Customer) => {
    try {
      if (editingCustomer) {
        const updated = await customerApi.update(editingCustomer.id, data);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? updated : c))
        );
        showToast("Customer updated successfully", "success");
      } else {
        const created = await customerApi.create(data);
        setCustomers((prev) => [...prev, created]);
        showToast("Customer created successfully", "success");
      }
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to save customer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Customer Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your customer database with ease
              </p>
            </div>
            <Button
              onClick={handleCreate}
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow whitespace-nowrap"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Customer
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Customer List */}
        {filteredAndSortedCustomers.length === 0 ? (
          <EmptyState
            message={
              debouncedSearchQuery
                ? "No customers found matching your search"
                : "No customers yet. Create your first customer!"
            }
            action={
              debouncedSearchQuery
                ? undefined
                : { label: "Add Customer", onClick: handleCreate }
            }
          />
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(
                  currentPage * pageSize,
                  filteredAndSortedCustomers.length
                )}{" "}
                of {filteredAndSortedCustomers.length} customers
              </p>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="pageSize"
                  className="text-sm text-gray-600 whitespace-nowrap"
                >
                  Per page:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortField === "name" && (
                            <span className="text-blue-600">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {sortField === "email" && (
                            <span className="text-blue-600">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center gap-2">
                          Phone
                          {sortField === "phone" && (
                            <span className="text-blue-600">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none"
                        onClick={() => handleSort("location")}
                      >
                        <div className="flex items-center gap-2">
                          Location
                          {sortField === "location" && (
                            <span className="text-blue-600">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and 2 pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      );
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if there's a gap
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[2.5rem] px-3 py-2 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white font-semibold"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {deletingCustomer && (
        <DeleteConfirmModal
          customer={deletingCustomer}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCustomer(null)}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
