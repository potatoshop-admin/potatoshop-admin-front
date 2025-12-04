import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Dashboard } from '@/types/dashboard';

const UserChart = ({ data }: { data: Dashboard }) => {
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

  return (
    <div className="h-fit flex-1/2 border-2 border-gray-200 rounded-2xl px-4 py-4">
      <div className="w-full h-10"></div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <AreaChart data={data.userDailyStatus}>
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
  );
};

export default UserChart;
