import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/lib/types";
import { customerApi, getErrorMessage } from "@/lib/api";

export function useCustomers(onError: (message: string) => void) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(err as Error);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    loading,
    error,
    setCustomers,
    reloadCustomers: loadCustomers,
  };
}
