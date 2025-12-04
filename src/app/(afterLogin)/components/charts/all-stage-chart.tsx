'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Categories, DailyCategorySales } from '@/types/dashboard';

interface RowType {
  date: string;
  skirt?: number;
  acc?: number;
  outwear?: number;
  pants?: number;
  top?: number;
  dress?: number;
}

const AllStageChart = ({
  dailyData,
  monthlyData,
}: {
  dailyData: Categories[];
  monthlyData: DailyCategorySales[];
}) => {
  const bChart = [
    { id: 'outwear', color: 'var(--color-primary-100)', stackId: 'a' },
    { id: 'top', color: 'var(--color-primary-200)', stackId: 'a' },
    { id: 'skirt', color: 'var(--color-primary-300)', stackId: 'a' },
    { id: 'pants', color: 'var(--color-primary-400)', stackId: 'a' },
    { id: 'dress', color: 'var(--color-primary-500)', stackId: 'a' },
    { id: 'acc', color: 'var(--color-primary-600)', stackId: 'a' },
  ];
  const bChartConfig = {
    category: {
      label: 'category',
    },
    outwear: {
      label: 'outwear',
      color: 'var(--primary-600)',
    },
    top: {
      label: 'top',
      color: 'var(--primary-500)',
    },
    skirt: {
      label: 'skirt',
      color: 'var(--primary-400)',
    },
    pants: {
      label: 'pants',
      color: 'var(--primary-300)',
    },
    dress: {
      label: 'dress',
      color: 'var(--primary-200)',
    },
    acc: {
      label: 'acc',
      color: 'var(--primary-100)',
    },
  } satisfies ChartConfig;

  const date = new Date();
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const formatedDate: string = `${year}년 ${month}월 ${day}일`;

  const [tab, setTab] = React.useState<number>(0);

  const categoryDailyData = dailyData.map((daily, index) => {
    return {
      stage: daily.category,
      category: daily.totalSales,
      fill: `var(--color-primary-${index + 1}00)`,
    };
  });

  const formattedMonthlyData = monthlyData.map((entry: DailyCategorySales) => {
    const row: RowType = { date: entry.date };

    entry.categories.forEach((item: Categories) => {
      row[item.category] = item.totalSales;
    });

    return row;
  });

  return (
    <div className="h-fit flex-1/2 border-2 border-gray-200 rounded-2xl px-4 py-4 overflow-y-scroll">
      <div className="w-full h-fit flex flex-col space-y-1 space-x-2 sm:flex-row sm:justify-between sm:items-center whitespace-nowrap overflow-x-scroll">
        <div className="w-fit h-fit space-x-1">
          <Button
            variant="roundOutline"
            size="roundedDefault"
            className={cn(tab === 0 && 'bg-primary-300 text-primary-50 border border-primary-300')}
            onClick={() => setTab(0)}
          >
            카테고리 별 판매 비율
          </Button>
          <Button
            variant="roundOutline"
            size="roundedDefault"
            className={cn(tab === 1 && 'bg-primary-300 text-primary-50 border border-primary-300')}
            onClick={() => setTab(1)}
          >
            최근 주문 수
          </Button>
        </div>
        <p className="font-14-bold text-primary-300 flex">
          <span className={cn(!tab ? 'block' : 'hidden')}> {formatedDate} </span>
          카테고리별 주문
        </p>
      </div>
      {tab === 0 ? (
        <ChartContainer
          config={bChartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto h-[250px] pb-0 font-14-medium text-gray-500 w-full"
        >
          <PieChart className="w-full h-fit">
            <ChartTooltip content={<ChartTooltipContent nameKey="stage" hideLabel />} />
            <Pie
              data={categoryDailyData}
              dataKey="category"
              nameKey="stage"
              labelLine={false}
              label={({ value, ...props }) => (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill="var(--color-gray-500)"
                  fontSize={10}
                >
                  {value}명
                </text>
              )}
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <ChartContainer config={bChartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={formattedMonthlyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={2}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ko-Ko', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(label, payload) => {
                    return `${new Date(label).toLocaleDateString('ko-Ko', {
                      month: 'short',
                      day: 'numeric',
                    })}`;
                  }}
                  indicator="line"
                />
              }
            />
            {bChart.map((data) => (
              <Bar
                key={data.id}
                dataKey={data.id}
                fill={data.color}
                stroke={data.color}
                stackId={data.stackId}
              />
            ))}
            <ChartLegend
              content={<ChartLegendContent />}
              className="h-10 overflow-x-scroll whitespace-nowrap"
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AllStageChart;
