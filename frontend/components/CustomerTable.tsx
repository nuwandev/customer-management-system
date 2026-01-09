"use client";

import { Customer } from "@/lib/types";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  sortBy: keyof Customer;
  sortOrder: "asc" | "desc";
  onSort: (field: keyof Customer) => void;
}

export function CustomerTable({
  customers,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: Readonly<CustomerTableProps>) {
  if (customers.length === 0) {
    return <EmptyState title="No customers found" />;
  }

  const getSortIcon = (field: keyof Customer) => {
    if (sortBy !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("firstName")}
            >
              First Name {getSortIcon("firstName")}
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("lastName")}
            >
              Last Name {getSortIcon("lastName")}
            </th>
            <th
              className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("email")}
            >
              Email {getSortIcon("email")}
            </th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-3">{customer.firstName}</td>
              <td className="px-4 py-3">{customer.lastName}</td>
              <td className="px-4 py-3">{customer.email}</td>
              <td className="px-4 py-3">{customer.phone || "N/A"}</td>
              <td className="px-4 py-3">
                {customer.address ? (
                  <>
                    {customer.address.line1}
                    {customer.address.line2 && `, ${customer.address.line2}`}
                    <br />
                    {customer.address.city}, {customer.address.state}{" "}
                    {customer.address.postalCode}
                  </>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(customer)}
                    variant="secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(customer)}
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
