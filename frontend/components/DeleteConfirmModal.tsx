"use client";

import { Customer } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  customer,
  isOpen,
  onClose,
  onConfirm,
}: Readonly<DeleteConfirmModalProps>) {
  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p className="mb-6">
        Are you sure you want to delete{" "}
        <strong>
          {customer.firstName} {customer.lastName}
        </strong>{" "}
        ? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
