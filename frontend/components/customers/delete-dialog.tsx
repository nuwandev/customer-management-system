"use client";

import { Customer } from "@/lib/types/customer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteDialog({
  customer,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-md p-4 my-4">
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-gray-600 mt-1">{customer.email}</div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
