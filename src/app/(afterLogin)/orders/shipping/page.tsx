import OrdersChart from '@/app/(afterLogin)/orders/components/ordersChart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '배송중 주문 조회 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

const Shipping = () => {
  return (
    <div className="w-full h-full p-4">
      <OrdersChart title="배송중" orderStatus="SHIPPING" />
    </div>
  );
};

export default Shipping;
