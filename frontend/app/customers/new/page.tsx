import { CustomerForm } from '@/components/customers/customer-form';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Customer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new customer by filling out the form below
        </p>
      </div>
      <CustomerForm mode="create" />
    </div>
  );
}