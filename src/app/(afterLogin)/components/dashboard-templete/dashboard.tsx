'use client';

import React, { Suspense } from 'react';
import { useGetDashboard } from '@/api/dashboard';
import Loading from '@/components/ui/loading';
import dynamic from 'next/dynamic';

const Cards = dynamic(() => import('@/app/(afterLogin)/components/dashboard-templete/cards'), {
  loading: () => <CardsSkeleton />,
});

const UserChart = dynamic(() => import('@/app/(afterLogin)/components/charts/user-chart'), {
  loading: () => <ChartSkeleton />,
});

const AllStageChart = dynamic(
  () => import('@/app/(afterLogin)/components/charts/all-stage-chart'),
  {
    loading: () => <ChartSkeleton />,
  }
);

const OrdersChart = dynamic(() => import('@/app/(afterLogin)/orders/components/ordersChart'), {
  loading: () => <ChartSkeleton />,
});

function CardsSkeleton() {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="h-24 bg-gray-200 rounded flex-1"></div>
      <div className="h-24 bg-gray-200 rounded flex-1"></div>
      <div className="h-24 bg-gray-200 rounded flex-1"></div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-80 bg-gray-200 rounded"></div>
    </div>
  );
}

const Dashboard = () => {
  const { data, isSuccess } = useGetDashboard();

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="w-full h-full px-4 py-4 flex flex-col space-y-4">
      <Suspense fallback={<CardsSkeleton />}>
        <Cards data={data.data} />
      </Suspense>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4">
        <Suspense fallback={<ChartSkeleton />}>
          <UserChart data={data.data} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <AllStageChart
            dailyData={data?.data.categoryDailySale}
            monthlyData={data?.data.dailyCategorySales}
          />
        </Suspense>
      </div>
      <OrdersChart title={'전체 주문 건'} />
    </div>
  );
};

export default Dashboard;
