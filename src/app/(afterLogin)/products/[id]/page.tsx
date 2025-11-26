import React from 'react';
import type { Metadata } from 'next';
import ItemDetail from '@/app/(afterLogin)/products/[id]/components/itemDetail';

interface PageProps {
  params: {
    [key: string]: string;
  };
}

export const metadata: Metadata = {
  title: '제품 상세 페이지 - Potato Admin',
  description: '의류 스토어 제품 관리 페이지',
  keywords:
    '의류, 패션, 옷, 상품 관리, 상품 등록, 제품 상세, 재고 관리, 쇼핑몰 관리자, Admin 시스템, Potato Admin',
};

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <ItemDetail id={id} />
    </main>
  );
}
