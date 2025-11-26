import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType } from '@/types/api';
import { Cs } from '@/types/cs';

export const useGetAllCs = () => {
  return useQuery({
    queryKey: ['AllCs'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/cs');
      return data;
    },
  });
};

export const useGetCs = (param: { id: number }) => {
  return useQuery({
    queryKey: ['cs', param.id],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/cs/${param.id}`);
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const usePatchCs = (options: { onSuccess: (e: ApiResponseType<Cs>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; cs: Partial<Cs> }) => {
      const { data } = await apiInstance.patch<ApiResponseType<Cs>>(
        `/cs/${payload.id}`,
        payload.cs
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['AllCs'] });
      queryClient.resetQueries({ queryKey: ['cs'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCs = (options: { onSuccess: (e: ApiResponseType<Cs>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await apiInstance.delete<ApiResponseType<Cs>>(`/cs/${payload.id}`);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['AllCs'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
