import React from 'react';
import OrderDetail from '@/app/(afterLogin)/orders/[id]/components/orderDetail';

interface PageProps {
  params: {
    [key: string]: string;
  };
}

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <OrderDetail id={id} />
    </main>
  );
}
