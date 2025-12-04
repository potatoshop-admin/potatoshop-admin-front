import React from 'react';
import CountCard from '@/app/(afterLogin)/components/dashboard-templete/count-card';
import { Dashboard } from '@/types/dashboard';

const Cards = ({ data }: { data: Dashboard }) => {
  return (
    <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <CountCard label="달 매출금액" value={data.monthlySalesAmount.toString()} />
      <CountCard label="전체 고객" value={data.totalCustomers.toString()} />
      <div className="w-full h-fit flex space-x-4">
        <CountCard label="주문 수" value={data.totalOrders.toString()} />
        <CountCard label="미배송" value={data.pendingDelivery.toString()} />
      </div>
      <div className="w-full h-fit flex space-x-4">
        <CountCard label="배송 중" value={data.shippingCount.toString()} />
        <CountCard label="베송 완료" value={data.deliveredCount.toString()} />
      </div>
      <div className="w-full h-fit flex sm:hidden xl:flex space-x-4">
        <CountCard label="총 문의 건" value={data.totalCsCount.toString()} />
        <CountCard label="답변 된 문의" value={data.answeredCsCount.toString()} />
      </div>
    </div>
  );
};

export default Cards;
