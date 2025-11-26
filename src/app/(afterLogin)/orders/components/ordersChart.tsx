'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as ReactTable,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useGetAllOrders } from '@/api/orders';
import { TableColumnsCreate } from '@/components/table';
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';
import { ColumnConfig } from '@/app/(afterLogin)/products/components/itemsChart';
import { URL } from '@/constants';
import { Grade } from '@/types/user';
import { Order, OrderStatus } from '@/types/order';

interface OrderChartProps {
  orderStatus?: OrderStatus;
  title: string;
}

export type CustomOrder = {
  storeId: number;
  name: string;
  grade: Grade;
  ordersId: number;
  orderItems: string[];
  orderStatus: OrderStatus;
  address: string;
  totalPrice: number;
  createdAt: string;
};

const OrdersChart = ({ orderStatus, title }: OrderChartProps) => {
  const router = useRouter();
  const { data, isSuccess } = useGetAllOrders({ orderStatus });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userTitleClick = (data: CustomOrder) => {
    const path = URL.ORDERS + '/' + data.ordersId;

    router.push(path);
  };
  const columnsData: ColumnConfig<CustomOrder>[] = [
    {
      accessorKey: 'ordersId',
      label: '주문 번호',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'name',
      label: '주문 고객',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'orderItems',
      label: '주문 제품',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'orderStatus',
      label: '진행 상태',
      options: 'filtered',
      filteredValues: [
        'PAID',
        'PROCESSING',
        'SHIPPING',
        'DELIVERED',
        'CANCEL_REQUESTED',
        'CANCELLED',
        'EXCHANGE_REQUESTED',
        'EXCHANGED',
        'RETURN_REQUESTED',
        'RETURNED',
      ],
      onClick: userTitleClick,
    },
    {
      accessorKey: 'totalPrice',
      label: '총 주문가격',
      options: 'sorted',
    },
  ];
  const columns: ColumnDef<CustomOrder>[] = TableColumnsCreate(columnsData);
  const processedData: CustomOrder[] = useMemo(() => {
    return data?.data.map(
      (order: Order): CustomOrder => ({
        ...order,
        name: `${order.user.name}  (${order.user.grade})`,
        grade: order.user.grade,
        orderItems:
          order.orderItems.length > 0
            ? order.orderItems.map((order) => `${order.itemTitle}-${order.quantity} `)
            : [],
      })
    );
  }, [data?.data]);
  const table: ReactTable<CustomOrder> = useReactTable({
    data: processedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      setPagination(updater);
    },
  });

  if (!isSuccess) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full h-full p-4">
      <ChartTemplate title={title} table={table} columnsData={columnsData} />
    </div>
  );
};

export default OrdersChart;
