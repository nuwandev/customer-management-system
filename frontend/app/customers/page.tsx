"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { customersApi } from "@/lib/api/customers";
import { SortField, SortOrder } from "@/lib/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerTable } from "@/components/customers/customer-table";
import { Pagination } from "@/components/customers/pagination";
import BackendOfflineCard from "@/components/ui/BackendOfflineCard";

export default function CustomersPage() {
  const [page, setPage] = useState(0);
  // Persist page size in localStorage
  const PAGE_SIZE_KEY = "customers_page_size";
  const [size, setSize] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(PAGE_SIZE_KEY);
      return stored ? Number(stored) : 10;
    }
    return 10;
  });

  // Update localStorage when size changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PAGE_SIZE_KEY, String(size));
    }
  }, [size]);
  const [sort, setSort] = useState<SortField>(SortField.CREATED_AT);
  const [order, setOrder] = useState<SortOrder>(SortOrder.ASC);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const queryClient = useQueryClient();

  // Fetch customers with all parameters
  const { data, isLoading, error } = useQuery({
    queryKey: ["customers", page, size, sort, order, search],
    queryFn: () =>
      customersApi.getCustomers({ page, size, sort, order, search }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: customersApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0); // Reset to first page on new search
  };

  const handleDelete = async (id: string) => {
    if (globalThis.confirm("Are you sure you want to delete this customer?")) {
      deleteMutation.mutate(id);
    }
  };

  const isBackendOffline =
    error && typeof error === "object" && "isNetworkError" in error;

  if (isBackendOffline) {
    return <BackendOfflineCard />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium text-red-600">
          Failed to load customers
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {typeof error === "string"
            ? error
            : "An unexpected error occurred. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customers</CardTitle>
            <Link href="/customers/new">
              <Button>Add Customer</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <form onSubmit={handleSearch} className="md:col-span-2 flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Search
              </Button>
              {search && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setPage(0);
                  }}
                >
                  Clear
                </Button>
              )}
            </form>

            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortField);
                setPage(0);
              }}
            >
              <option value={SortField.CREATED_AT}>Created At</option>
              <option value={SortField.FIRST_NAME}>First Name</option>
              <option value={SortField.LAST_NAME}>Last Name</option>
              <option value={SortField.EMAIL}>Email</option>
            </Select>

            <Select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as SortOrder);
                setPage(0);
              }}
            >
              <option value={SortOrder.ASC}>Ascending</option>
              <option value={SortOrder.DESC}>Descending</option>
            </Select>

            {/* Page Size Dropdown */}
            <Select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              label="Rows per page"
            >
              {[10, 25, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading customers...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && data?.content.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No customers found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try adjusting your search criteria"
                  : "Get started by creating a new customer"}
              </p>
              {!search && (
                <div className="mt-6">
                  <Link href="/customers/new">
                    <Button>Add Customer</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Customer Table */}
          {!isLoading && data && data.content.length > 0 && (
            <>
              <CustomerTable
                customers={data.content}
                onDelete={handleDelete}
                isDeleting={
                  deleteMutation.isPending
                    ? deleteMutation.variables
                    : undefined
                }
              />

              <div className="mt-4">
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                  isFirst={data.isFirst}
                  isLast={data.isLast}
                />
              </div>

              <div className="mt-4 text-sm text-gray-600 text-center">
                Showing {data.content.length} of {data.totalElements} customers
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
