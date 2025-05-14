import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDepartmentSelectQuery = () => {
  const fetchDepartmentList = async () => {
    const response = await fetch('/api/admin/departments/select');

    if (!response.ok) {
      toast.error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
        { position: 'top-center' },
      );
    }

    return response.json();
  };

  return useQuery({
    queryKey: ['departments-select'],
    queryFn: fetchDepartmentList,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
