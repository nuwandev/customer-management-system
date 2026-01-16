"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CustomerFormProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, "id"> | Customer) => void;
}

export function CustomerForm({
  customer,
  isOpen,
  onClose,
  onSave,
}: Readonly<CustomerFormProps>) {
  const [formData, setFormData] = useState<Omit<Customer, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSave({ ...customer, ...formData });
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add Customer"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>
        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-3">Address</h3>
          <Input
            label="Address Line 1"
            value={formData.address?.line1 || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address!, line1: e.target.value },
              })
            }
          />
          <Input
            label="Address Line 2"
            value={formData.address?.line2 || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address!, line2: e.target.value },
              })
            }
          />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              label="City"
              value={formData.address?.city || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address!, city: e.target.value },
                })
              }
            />
            <Input
              label="State"
              value={formData.address?.state || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address!, state: e.target.value },
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              label="Postal Code"
              value={formData.address?.postalCode || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address!, postalCode: e.target.value },
                })
              }
            />
            <Input
              label="Country"
              value={formData.address?.country || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address!, country: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {customer ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
