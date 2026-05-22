import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType, AxiosErrorResponse } from '@/types/api';
import { AdminUser, RoleType } from '@/types/adminUser';

export const useGetAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/adminUser');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분 (권한 변경은 빈번하지 않음)
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

/** 로그인 응답에서 반환되는 유저 정보 (토큰 미포함) */
export interface LoginUser {
  name: string;
  id: string;
  role: RoleType;
  storeId: number;
}

export interface LoginResponse extends ApiResponseType<null> {
  user: LoginUser;
}

/**
 * useLogin
 *
 * [보안 변경]
 * - 이전: Spring 직접 호출 → JWT를 js-cookie에 저장 (XSS 취약)
 * - 현재: Next.js /api/auth/login 호출 → 서버가 httpOnly 쿠키 설정
 *         클라이언트는 user info만 수신 (JWT 절대 노출 없음)
 */
export const useLogin = (options: {
  onSuccess: (e: LoginResponse) => void;
  onError: (e: AxiosErrorResponse) => void;
}) =>
  useMutation({
    mutationFn: async (payload: { logInId: string; password: string }): Promise<LoginResponse> => {
      const res = await fetch('/fashion-admin/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        const error = { response: { data } } as unknown as AxiosErrorResponse;
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error as AxiosErrorResponse);
    },
  });

/**
 * useLogout
 *
 * Next.js /api/auth/logout 호출 → 서버에서 httpOnly 쿠키 삭제
 * 클라이언트 JS로는 httpOnly 쿠키를 직접 삭제할 수 없으므로 서버 라우트 필수
 */
export const useLogout = (options?: { onSuccess?: () => void }) =>
  useMutation({
    mutationFn: async () => {
      const res = await fetch('/fashion-admin/api/auth/logout', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
