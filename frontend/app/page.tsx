"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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

  // Load customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getAll();
        setCustomers(data);
      } catch (err) {
        showToast(getErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, [showToast]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState<keyof Customer>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let result = customers;

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

    result = [...result].sort((a, b) => {
      const getValue = (obj: Customer, key: keyof Customer) => {
        const value = obj[key];
        if (typeof value === "object" || value === undefined) return "";
        return String(value);
      };
      const aValue = getValue(a, sortBy).toLowerCase();
      const bValue = getValue(b, sortBy).toLowerCase();
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    return result;
  }, [customers, debouncedSearchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedCustomers, currentPage, pageSize]);

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
    (field: keyof Customer) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingCustomer) return;

    try {
      await customerApi.delete(deletingCustomer.id.toString());
      setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
      showToast("Customer deleted successfully", "success");
      setDeletingCustomer(null);
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  }, [deletingCustomer, showToast, setCustomers]);

  const handleFormSubmit = useCallback(
    async (data: Omit<Customer, "id"> | Customer) => {
      try {
        if (editingCustomer) {
          const updated = await customerApi.update(
            editingCustomer.id.toString(),
            data
          );
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
        showToast(getErrorMessage(error), "error");
      }
    },
    [editingCustomer, showToast, setCustomers]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h1>
          <Button onClick={handleCreate}>Add Customer</Button>
        </div>

        <Input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6"
        />

        <CustomerTable
          customers={paginatedCustomers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {totalPages > 1 && (
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
        )}

        <CustomerForm
          customer={editingCustomer}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleFormSubmit}
        />

        <DeleteConfirmModal
          customer={deletingCustomer}
          isOpen={!!deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onConfirm={handleDeleteConfirm}
        />

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
