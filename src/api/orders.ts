import apiInstance from '@/api/apiInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus } from '@/types/order';
import { ApiResponseType } from '@/types/api';

export const useGetAllOrders = (params?: { orderStatus?: OrderStatus }) => {
  return useQuery({
    queryKey: ['orders', params?.orderStatus],
    queryFn: async () => {
      const { data } = await apiInstance.get('/orders', {
        params,
      });
      return data;
    },
    staleTime: 1000 * 30, // 30초 (주문은 자주 변경됨)
  });
};

export interface OrderPageParams {
  orderStatus?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  search?: string;
}

export interface PagedOrderResponse {
  data: {
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
  };
  success: boolean;
  statusMessage: string;
  statusNumber: number;
}

export const useGetOrdersPaged = (params: OrderPageParams) => {
  const { page = 0, size = 10, sort = 'createdAt', direction = 'desc', ...rest } = params;
  return useQuery({
    queryKey: ['orders-paged', rest.orderStatus, page, size, sort, direction, rest.search],
    queryFn: async () => {
      const { data } = await apiInstance.get<PagedOrderResponse>('/orders/paged', {
        params: {
          ...rest,
          page,
          size,
          sort: `${sort},${direction}`,
        },
      });
      return data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useGetOrder = (param: { id: number }) => {
  return useQuery({
    queryKey: ['order', param.id],
    queryFn: async () => {
      const { data } = await apiInstance.get(`/orders/${param.id}`);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const usePatchOrder = (options: { onSuccess: (e: ApiResponseType<Order>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; order: Partial<Order> }) => {
      const { data } = await apiInstance.patch<ApiResponseType<Order>>(
        `/orders/${payload.id}`,
        payload.order
      );
      return data;
    },
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteOrder = (options: { onSuccess: (e: ApiResponseType<Order>) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number }) => {
      const { data } = await apiInstance.delete<ApiResponseType<Order>>(`/orders/${payload.id}`);
      return data;
    },
    ...options,
    onSuccess: (data: ApiResponseType<Order>) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
