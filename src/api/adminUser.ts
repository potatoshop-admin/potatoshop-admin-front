import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType, AxiosErrorResponse } from '@/types/api';
import { AdminUser, RoleType } from '@/types/adminUser';
import Cookies from 'js-cookie';

export const useGetAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/adminUser');
      return data;
    },
  });
};

export const usePostAdminUsers = (options: {
  onSuccess: (e: ApiResponseType<AdminUser>) => void;
  onError: (e: AxiosErrorResponse) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      storeId: number;
      logInId: string;
      password: string;
    }) => {
      const { data } = await apiInstance.post<ApiResponseType<AdminUser>>('/adminUser', payload);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUser'] });
      options?.onSuccess?.(data);
    },
  });
};

export const usePatchManager = (options: {
  onSuccess: (e: ApiResponseType<AdminUser>) => void;
  onError: (e: AxiosErrorResponse) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; role: RoleType }) => {
      const { data } = await apiInstance.patch<ApiResponseType<AdminUser>>(
        `/adminUser/${payload.id}/role`,
        { role: payload.role }
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUser'] });
      options?.onSuccess?.(data);
    },
  });
};

export const useLogin = (options: {
  onSuccess: (
    e: ApiResponseType<null> & {
      token: string;
    }
  ) => void;
  onError: (e: AxiosErrorResponse) => void;
}) =>
  useMutation({
    mutationFn: async (payload: { logInId: string; password: string }) => {
      const { data, headers } = await apiInstance.post('/auth/login', payload);
      const token = headers['authorization'];
      if (token) {
        // 쿠키에 저장
        Cookies.set('token', token);
      }
      return { ...data, token }; // ← 토큰만 넘겨줌
    },
    ...options,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
