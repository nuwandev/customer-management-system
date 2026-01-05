"use client";

import React, { useState } from "react";
import { Customer } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  customer: Customer;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  customer,
  onConfirm,
  onCancel,
}: Readonly<DeleteConfirmModalProps>) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Delete Customer"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <p className="text-gray-700 text-center font-medium">
          Are you sure you want to delete this customer?
        </p>
        <p className="text-gray-500 text-center text-sm">
          This action cannot be undone.
        </p>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {customer.firstName[0]}
                {customer.lastName[0]}
              </span>
            </div>
            <div className="ml-4">
              <div className="font-semibold text-gray-900">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-sm text-gray-600">{customer.email}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
