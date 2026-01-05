"use client";

import React, { useState } from "react";
import { Customer, Address } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api";

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (data: Customer) => Promise<void>;
  onClose: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  "address.line1"?: string;
  "address.city"?: string;
  "address.country"?: string;
}

export function CustomerForm({
  customer,
  onSubmit,
  onClose,
}: Readonly<CustomerFormProps>) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...(prev.address || ({} as Address)), [field]: value },
    }));
    // Clear error when user types
    const errorKey = `address.${field}` as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = "First name must be 100 characters or less";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = "Last name must be 100 characters or less";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Optional address validation
    if (
      formData.address?.line1 ||
      formData.address?.city ||
      formData.address?.country
    ) {
      if (!formData.address.line1?.trim()) {
        newErrors["address.line1"] =
          "Address line 1 is required when providing address";
      }
      if (!formData.address.city?.trim()) {
        newErrors["address.city"] = "City is required when providing address";
      }
      if (!formData.address.country?.trim()) {
        newErrors["address.country"] =
          "Country is required when providing address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData as Customer);
    } catch (error) {
      if (error instanceof ApiError && error.details?.errors) {
        // Map backend errors to form fields
        const backendErrors: FormErrors = {};
        error.details.errors.forEach((err) => {
          backendErrors[err.field as keyof FormErrors] = err.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({
          email:
            error instanceof Error ? error.message : "Failed to save customer",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add Customer"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            {customer ? "Update" : "Create"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              error={errors.firstName}
              disabled={isSubmitting}
            />
            <Input
              label="Last Name *"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              error={errors.lastName}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Details
          </h3>
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            disabled={isSubmitting}
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="+1 555 123 4567"
            disabled={isSubmitting}
          />
        </div>

        {/* Address Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Address (Optional)
          </h3>

          <div className="space-y-4">
            <Input
              label="Address Line 1"
              type="text"
              value={formData.address?.line1 || ""}
              onChange={(e) => handleAddressChange("line1", e.target.value)}
              error={errors["address.line1"]}
              disabled={isSubmitting}
            />

            <Input
              label="Address Line 2"
              type="text"
              value={formData.address?.line2 || ""}
              onChange={(e) => handleAddressChange("line2", e.target.value)}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                type="text"
                value={formData.address?.city || ""}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                error={errors["address.city"]}
                disabled={isSubmitting}
              />

              <Input
                label="State / Province"
                type="text"
                value={formData.address?.state || ""}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                type="text"
                value={formData.address?.postalCode || ""}
                onChange={(e) =>
                  handleAddressChange("postalCode", e.target.value)
                }
                disabled={isSubmitting}
              />

              <Input
                label="Country"
                type="text"
                value={formData.address?.country || ""}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                error={errors["address.country"]}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
