'use client';

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
import { useRouter } from 'next/navigation';
import { TableColumnsCreate } from '@/components/table';
import React, { useMemo, useState } from 'react';
import { URL } from '@/constants';
import { ColumnConfig } from '@/app/(afterLogin)/users/components/usersChart';
import { useGetAllReview } from '@/api/review';
import { Review } from '@/types/review';
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';

export type CustomerReview = {
  storeId: number;
  userId: number;
  itemId: number;
  reviewId: number;
  title: string;
  userName: string;
  rate: string;
  content: string;
};
const ReviewChart = () => {
  const router = useRouter();

  const { data, isSuccess } = useGetAllReview();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userTitleClick = (data: CustomerReview) => {
    const path = URL.REVIEWS + '/' + data.reviewId;

    router.push(path);
  };
  const columnsData: ColumnConfig<CustomerReview>[] = [
    {
      accessorKey: 'reviewId',
      label: 'id',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'title',
      label: '리뷰 제품',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'userName',
      label: '리뷰 작성자',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'rate',
      label: '리뷰 평점',
      options: 'filtered',
      filteredValues: ['1', '2', '3', '4', '5'],
    },
    {
      accessorKey: 'content',
      label: '문의 진행 상황',
      options: 'sorted',
    },
  ];
  const columns: ColumnDef<CustomerReview>[] = TableColumnsCreate(columnsData);

  const processedData: CustomerReview[] = useMemo(() => {
    return data?.data.map(
      (review: Review): CustomerReview => ({
        ...review,
        rate: review.rate.toString(),
      })
    );
  }, [data?.data]);

  const table: ReactTable<CustomerReview> = useReactTable({
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
      <ChartTemplate title="리뷰 차트" table={table} columnsData={columnsData} />
    </div>
  );
};

export default ReviewChart;
