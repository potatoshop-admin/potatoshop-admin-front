import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType } from '@/types/api';
import { Review } from '@/types/review';

export const useGetAllReview = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/review');
      return data;
    },
  });
};

export const useGetReview = (param: { id: number }) => {
  return useQuery({
    queryKey: ['review', param.id],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/review/${param.id}`);
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const usePatchReview = (options: { onSuccess: (e: ApiResponseType<Review>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; review: Partial<Review> }) => {
      const { data } = await apiInstance.patch<ApiResponseType<Review>>(
        `/review/${payload.id}`,
        payload.review
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.resetQueries({ queryKey: ['review'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteReview = (options: { onSuccess: (e: ApiResponseType<Review>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await apiInstance.delete<ApiResponseType<Review>>(`/review/${payload.id}`);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
