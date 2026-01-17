'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customersApi } from '@/lib/api/customers';
import { CustomerCreateRequest, CustomerUpdateRequest, CustomerStatus, Customer } from '@/lib/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerFormProps {
  customer?: Customer;
  mode: 'create' | 'edit';
}

type FormData = CustomerCreateRequest | (CustomerUpdateRequest & { email?: string });

export function CustomerForm({ customer, mode }: CustomerFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone || '',
          status: customer.status,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          status: CustomerStatus.ACTIVE,
        },
  });

  const createMutation = useMutation({
    mutationFn: customersApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      router.push('/customers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerUpdateRequest }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', customer?.id] });
      router.push('/customers');
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data as CustomerCreateRequest);
      } else if (customer) {
        const { email, ...updateData } = data;
        await updateMutation.mutateAsync({
          id: customer.id,
          data: updateData as CustomerUpdateRequest,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const mutation = mode === 'create' ? createMutation : updateMutation;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Customer' : 'Edit Customer'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <Input
            label="First Name *"
            {...register('firstName', {
              required: 'First name is required',
              minLength: { value: 1, message: 'First name must not be empty' },
            })}
            error={errors.firstName?.message}
            placeholder="John"
          />

          {/* Last Name */}
          <Input
            label="Last Name *"
            {...register('lastName', {
              required: 'Last name is required',
              minLength: { value: 1, message: 'Last name must not be empty' },
            })}
            error={errors.lastName?.message}
            placeholder="Doe"
          />

          {/* Email - only editable in create mode */}
          <Input
            label="Email *"
            type="email"
            {...register('email', {
              required: mode === 'create' ? 'Email is required' : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
            placeholder="john.doe@example.com"
            disabled={mode === 'edit'}
            className={mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''}
          />
          {mode === 'edit' && (
            <p className="text-sm text-gray-500 -mt-4">Email cannot be changed</p>
          )}

          {/* Phone */}
          <Input
            label="Phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+1 (555) 123-4567"
          />

          {/* Status */}
          <Select
            label="Status *"
            {...register('status', { required: 'Status is required' })}
            error={errors.status?.message}
          >
            <option value={CustomerStatus.ACTIVE}>Active</option>
            <option value={CustomerStatus.INACTIVE}>Inactive</option>
          </Select>

          {/* Error Message */}
          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Failed to save customer. Please try again.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'create'
                ? 'Create Customer'
                : 'Update Customer'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/customers')}
              disabled={mutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}