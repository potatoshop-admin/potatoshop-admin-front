import type { Metadata } from 'next';
import OrdersChart from '@/app/(afterLogin)/orders/components/ordersChart';

export const metadata: Metadata = {
  title: '결제 완료 주문 조회 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

const Paid = () => {
  return (
    <div>
      <OrdersChart title="결제 완료" orderStatus="PAID" />
    </div>
  );
};

export default Paid;
