'use client';

import React from 'react';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import DashboardCard from '@/app/(afterLogin)/components/dashboard-card';
import AllStageChart from '@/app/(afterLogin)/components/charts/all-stage-chart';
import OrdersChart from '@/app/(afterLogin)/orders/components/ordersChart';
import { useGetDashboard } from '@/api/dashboard';

interface UserStatus {
  date: string;
  totalUsers: number;
  newUsers: number;
}

const Dashboard = () => {
  const { data, isSuccess } = useGetDashboard();

  const chart = [
    { id: 'totalUsers', color: 'var(--color-primary-600)', stackId: 'a' },
    { id: 'newUsers', color: 'var(--color-primary-400)', stackId: 'b' },
  ];

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    totalUsers: {
      label: '전체 고객수',
      color: 'var(--primary-600)',
    },
    newUsers: {
      label: '유입된 고객',
      color: 'var(--primary-400)',
    },
  } satisfies ChartConfig;

  if (!isSuccess) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full h-full px-4 py-4 flex flex-col space-y-4">
      <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <DashboardCard label="달 매출금액" value={data.data.monthlySalesAmount} />
        <DashboardCard label="전체 고객" value={data.data.totalCustomers} />
        <div className="w-full h-fit flex space-x-4">
          <DashboardCard label="주문 수" value={data.data.totalOrders} />
          <DashboardCard label="미배송" value={data.data.pendingDelivery} />
        </div>
        <div className="w-full h-fit flex space-x-4">
          <DashboardCard label="배송 중" value={data.data.shippingCount} />
          <DashboardCard label="베송 완료" value={data.data.deliveredCount} />
        </div>
        <div className="w-full h-fit flex sm:hidden xl:flex space-x-4">
          <DashboardCard label="총 문의 건" value={data.data.totalCsCount} />
          <DashboardCard label="답변 된 문의" value={data.data.answeredCsCount} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4">
        <div className="h-fit flex-1/2 border-2 border-gray-200 rounded-2xl px-4 py-4">
          <div className="w-full h-10"></div>
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data.data.userDailyStatus}>
              <defs>
                {chart.map((data) => (
                  <linearGradient key={data.id} id={data.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={data.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={data.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('ko-KO', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('ko-KO', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {chart.map((data) => (
                <Area
                  key={data.id}
                  dataKey={data.id}
                  type="natural"
                  fill={`url(#${data.id})`}
                  stroke={data.color}
                  stackId={data.stackId}
                />
              ))}
              <ChartLegend
                content={<ChartLegendContent />}
                className="h-10 overflow-x-scroll whitespace-nowrap"
              />
            </AreaChart>
          </ChartContainer>
        </div>
        <AllStageChart
          dailyData={data?.data.categoryDailySale}
          monthlyData={data?.data.dailyCategorySales}
        />
      </div>
      <OrdersChart title={'전체 주문 건'} />
    </div>
  );
};

export default Dashboard;
