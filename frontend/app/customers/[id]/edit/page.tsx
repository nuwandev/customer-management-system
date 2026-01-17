'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { customersApi } from '@/lib/api/customers';
import { CustomerForm } from '@/components/customers/customer-form';
import { Card, CardContent } from '@/components/ui/card';

export default function EditCustomerPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.getCustomerById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading customer...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600 py-12">
              <p className="text-lg font-semibold">Error loading customer</p>
              <p className="text-sm mt-2">
                {error instanceof Error ? error.message : 'Customer not found'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update customer information below
        </p>
      </div>
      <CustomerForm customer={customer} mode="edit" />
    </div>
  );
}