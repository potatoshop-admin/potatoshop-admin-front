import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType } from '@/types/api';
import { User } from '@/types/user';

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/users');
      return data;
    },
  });
};

export const useGetUser = (param: { id: number }) => {
  return useQuery({
    queryKey: ['user', param.id],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/users/${param.id}`);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const usePatchUser = (options: { onSuccess: (e: ApiResponseType<User>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; user: Partial<User> }) => {
      const { data } = await apiInstance.patch<ApiResponseType<User>>(
        `/users/${payload.id}`,
        payload.user
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['user'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useDeleteUser = (options: { onSuccess: (e: ApiResponseType<User>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await apiInstance.delete<ApiResponseType<User>>(`/users/${payload.id}`);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
