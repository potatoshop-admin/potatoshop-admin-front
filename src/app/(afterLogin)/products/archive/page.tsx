import type { Metadata } from 'next';
import ItemsChart from '@/app/(afterLogin)/products/components/itemsChart';

export const metadata: Metadata = {
  title: '아카이브 제품 조회 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

const Archive = () => {
  return (
    <div className="w-full h-full px-4 py-4">
      <ItemsChart chartTitle="지난 시즌 상품" season="ARCHIVE" />
    </div>
  );
};

export default Archive;
