"use client";

import { useState } from "react";
import Link from "next/link";
import { Customer, CustomerStatus } from "@/lib/types/customer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DeleteDialog } from "./delete-dialog";

interface CustomerTableProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  isDeleting?: string;
}

export function CustomerTable({
  customers,
  onDelete,
  isDeleting,
}: CustomerTableProps) {
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  const handleDeleteClick = (customer: Customer) => {
    setDeleteCustomer(customer);
  };

  const handleDeleteConfirm = () => {
    if (deleteCustomer) {
      onDelete(deleteCustomer.id);
      setDeleteCustomer(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {customer.phone || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      customer.status === CustomerStatus.ACTIVE
                        ? "success"
                        : "warning"
                    }
                  >
                    {customer.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(customer)}
                    disabled={isDeleting === customer.id}
                  >
                    {isDeleting === customer.id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteDialog
        customer={deleteCustomer}
        open={!!deleteCustomer}
        onOpenChange={(open) => !open && setDeleteCustomer(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={!!deleteCustomer && isDeleting === deleteCustomer.id}
      />
    </>
  );
}
