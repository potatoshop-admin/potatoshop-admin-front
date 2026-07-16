import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import apiInstance from '@/api/apiInstance';
import { ApiResponseType } from '@/types/api';
import { Images, Item, Season } from '@/types/item';

/** 압축 전후 통계 */
export interface CompressionStats {
  count: number;
  totalBeforeKB: number;
  totalAfterKB: number;
  avgReductionPct: number;
}

export interface PostImagesResult extends ApiResponseType<Images[]> {
  compressionStats: CompressionStats;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg' as const, // 압축 출력은 항상 JPEG
  initialQuality: 0.85,
};

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
    mutationFn: async (payload: { id: number; file: File[] }): Promise<PostImagesResult> => {
      // 1️⃣ 파일별 압축 + 전후 사이즈 기록
      const compressionResults = await Promise.all(
        payload.file.map(async (file) => {
          const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
          return {
            original: file,
            compressed,
            beforeKB: Math.round(file.size / 1024),
            afterKB: Math.round(compressed.size / 1024),
            reductionPct: Math.round((1 - compressed.size / file.size) * 100),
          };
        })
      );

      // 2️⃣ 압축본을 백엔드에 전송 → presigned URL 2개(압축/원본) 수신
      const formData = new FormData();
      for (const result of compressionResults) {
        // 원본 파일명 유지하여 백엔드 presigned URL 생성에 활용
        formData.append('file', result.compressed, result.original.name);
      }

      const { data } = await apiInstance.post<ApiResponseType<Images[]>>(
        `/itemsImage/${payload.id}`,
        formData
      );

      // 3️⃣ S3 직접 업로드: 압축본 → url, 원본 → originalUrl
      if (data.data && data.data.length > 0) {
        await Promise.all(
          data.data.map(async (image: Images, index: number) => {
            const result = compressionResults[index];
            await uploadToS3(image.url, result.compressed);
            if (image.originalUrl) {
              await uploadToS3(image.originalUrl, result.original);
            }
          })
        );
      }

      // 4️⃣ 압축 통계 계산
      const totalBeforeKB = compressionResults.reduce((sum, r) => sum + r.beforeKB, 0);
      const totalAfterKB = compressionResults.reduce((sum, r) => sum + r.afterKB, 0);
      const avgReductionPct = Math.round(
        compressionResults.reduce((sum, r) => sum + r.reductionPct, 0) / compressionResults.length
      );

      return {
        ...data,
        compressionStats: {
          count: compressionResults.length,
          totalBeforeKB,
          totalAfterKB,
          avgReductionPct,
        },
      };
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
