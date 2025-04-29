import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useKidSelectQuery = () => {
  const fetchKidList = async () => {
    const response = await fetch('/api/parents/kids/select');

    if (!response.ok) {
      toast.error(
        'Oops! Something didn’t go as planned. Please try again in a moment.',
        { position: 'top-center' },
      );
    }

    return response.json();
  };

  return useQuery({
    queryKey: ['kids-select'],
    queryFn: fetchKidList,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
