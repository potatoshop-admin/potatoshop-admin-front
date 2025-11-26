import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType, AxiosErrorResponse } from '@/types/api';
import { Store } from '@/types/store';

export const useGetStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/stores');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    refetchOnWindowFocus: true, // 탭 포커스 시 stale면 자동 refetch
  });
};

export const usePostStores = (options: {
  onSuccess: (e: ApiResponseType<Store>) => void;
  onError: (e: AxiosErrorResponse) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { storeName: string }) => {
      const { data } = await apiInstance.post<ApiResponseType<Store>>('/stores', payload);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      options?.onSuccess?.(data);
    },
  });
};
