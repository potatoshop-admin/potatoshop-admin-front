import type { Metadata } from 'next';
import CsChart from '@/app/(afterLogin)/cs/components/csChart';

export const metadata: Metadata = {
  title: 'cs 조회 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

const CS = () => {
  return (
    <div>
      <CsChart />
    </div>
  );
};

export default CS;
