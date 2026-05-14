import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { getAllOrdersServer } from '@/api/orders.server';
import OrdersChart from '@/app/(afterLogin)/orders/components/ordersChart';

export const metadata: Metadata = {
  title: '주문 조회 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

const Orders = async () => {
  const queryClient = getQueryClient();

  // queryKey 는 useGetAllOrders 의 키와 정확히 일치해야 한다: ['orders', params?.orderStatus]
  // 여기서는 전체 주문(필터 없음)이라 두 번째 요소가 undefined.
  await queryClient.prefetchQuery({
    queryKey: ['orders', undefined],
    queryFn: () => getAllOrdersServer({ orderStatus: undefined }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full p-4">
        <OrdersChart title="전체 주문" />
      </div>
    </HydrationBoundary>
  );
};

export default Orders;
