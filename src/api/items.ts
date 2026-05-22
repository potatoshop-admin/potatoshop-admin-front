import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType } from '@/types/api';
import { Images, Item, Season } from '@/types/item';

export const useGetAllItems = (params?: { season?: Season }) => {
  return useQuery({
    queryKey: ['items', params?.season],
    queryFn: async () => {
      const { data } = await apiInstance.get('/items', { params });
      return data;
    },
    staleTime: 1000 * 60 * 3, // 3분
  });
};

export const useGetItem = (param: { id: number }) => {
  return useQuery({
    queryKey: ['item', param.id],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/items/${param.id}`);
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const usePostItems = (options: { onSuccess: (e: ApiResponseType<Item>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      category: string;
      season: string;
      costPrice: number;
      listPrice: number;
      salePrice: number;
      discountRateBps: number;
      stock: number;
    }) => {
      const { data } = await apiInstance.post<ApiResponseType<Item>>('/items', payload);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
      options?.onSuccess?.(data);
    },
  });
};

export const usePatchItems = (options: { onSuccess: (e: ApiResponseType<Item>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; item: Partial<Item> }) => {
      const { data } = await apiInstance.patch<ApiResponseType<Item>>(
        `/items/${payload.id}`,
        payload.item
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['item'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      options?.onSuccess?.(data);
    },
  });
};

export const useDeleteItem = (options: { onSuccess: (e: ApiResponseType<Item>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await apiInstance.delete<ApiResponseType<Item>>(`/items/${payload.id}`);
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      options?.onSuccess?.(data);
    },
  });
};

export const usePostItemImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; file: File[] }) => {
      const formData = new FormData();
      for (const f of payload.file) {
        formData.append('file', f);
      }
      // Authorization은 프록시 서버가 httpOnly 쿠키에서 자동 주입
      // Content-Type은 axios가 FormData 감지 시 boundary 포함하여 자동 설정
      const { data } = await apiInstance.post<ApiResponseType<Images[]>>(
        `/itemsImage/${payload.id}`,
        formData
      );

      if (data.data && data.data.length > 0) {
        data.data.forEach((image: Images, index: number) => {
          uploadToS3(image.url, payload.file[index]);
        });
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

const uploadToS3 = async (presignedUrl: string, file: File) => {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`S3 업로드 실패: ${res.statusText}`);
  }
};

export const useDeleteItemImages = (options: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: number; file: string[] }) => {
      const formattedData = payload.file.map((url) => ({ url }));
      // Authorization은 프록시 서버가 httpOnly 쿠키에서 자동 주입
      const { data } = await apiInstance.delete<ApiResponseType<Images[]>>(
        `/itemsImage/${payload.id}`,
        { data: formattedData }
      );
      return data;
    },
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      options?.onSuccess?.();
    },
  });
};
