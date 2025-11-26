import { useQuery } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/dashboard');
      return data;
    },
  });
};
