'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  SortingState,
  Table as ReactTable,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useGetOrdersPaged } from '@/api/orders';
import { TableColumnsCreate } from '@/components/table';
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';
import { ColumnConfig } from '@/app/(afterLogin)/products/components/itemsChart';
import { URL } from '@/constants';
import { Grade } from '@/types/user';
import { Order, OrderStatus } from '@/types/order';
import Loading from '@/components/ui/loading';

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // 정렬 상태를 서버 파라미터로 변환
  const sortParam = sorting[0];
  const { data, isSuccess, isFetching } = useGetOrdersPaged({
    orderStatus,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort: sortParam?.id ?? 'createdAt',
    direction: sortParam?.desc ? 'desc' : 'asc',
    // 컬럼 필터에서 orderStatus 필터 추출 (서버에 전달)
    ...(columnFilters.find((f) => f.id === 'orderStatus')
      ? { orderStatus: columnFilters.find((f) => f.id === 'orderStatus')!.value as OrderStatus }
      : {}),
  });

  const userTitleClick = useCallback(
    (data: CustomOrder) => {
      router.push(URL.ORDERS + '/' + data.ordersId);
    },
    [router]
  );

  const columnsData: ColumnConfig<CustomOrder>[] = useMemo(
    () => [
      { accessorKey: 'ordersId', label: '주문 번호', options: 'sorted', onClick: userTitleClick },
      { accessorKey: 'name', label: '주문 고객', options: 'sorted', onClick: userTitleClick },
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
      { accessorKey: 'totalPrice', label: '총 주문가격', options: 'sorted' },
    ],
    [userTitleClick]
  );

  const columns: ColumnDef<CustomOrder>[] = useMemo(
    () => TableColumnsCreate(columnsData),
    [columnsData]
  );

  const processedData: CustomOrder[] = useMemo(() => {
    if (!data?.data?.content) return [];
    return data.data.content.map(
      (order: Order): CustomOrder => ({
        ...order,
        name: `${order.user.name}  (${order.user.grade})`,
        grade: order.user.grade,
        orderItems:
          order.orderItems.length > 0
            ? order.orderItems.map((item) => `${item.itemTitle}-${item.quantity} `)
            : [],
      })
    );
  }, [data?.data?.content]);

  const pageCount = data?.data?.totalPages ?? -1;

  const table: ReactTable<CustomOrder> = useReactTable({
    data: processedData,
    columns,
    // 서버에서 정렬/필터/페이지네이션을 처리하므로 manual 모드 활성화
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    onSortingChange: (updater) => {
      setSorting((prev) => (typeof updater === 'function' ? updater(prev) : updater));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters((prev) => (typeof updater === 'function' ? updater(prev) : updater));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    getCoreRowModel: getCoreRowModel(),
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
      setPagination((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    },
  });

  if (!isSuccess) {
    return <Loading />;
  }

  return (
    <div className={isFetching ? 'opacity-70 transition-opacity duration-200' : ''}>
      <ChartTemplate title={title} table={table} columnsData={columnsData} />
    </div>
  );
};

export default OrdersChart;
