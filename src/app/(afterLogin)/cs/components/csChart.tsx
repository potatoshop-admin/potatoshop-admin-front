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
import { useGetAllCs } from '@/api/cs';
import { Cs, CsStatus } from '@/types/cs';
import { ColumnConfig } from '@/app/(afterLogin)/users/components/usersChart';
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';
import Loading from '@/components/ui/loading';

export type CustomerCs = {
  csId: number;
  userId: number;
  ordersId: number;
  csStatus: CsStatus;
  question: string;
  answer: string;
};
const CsChart = () => {
  const router = useRouter();

  const { data, isSuccess } = useGetAllCs();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userTitleClick = (data: CustomerCs) => {
    const path = URL.CS + '/' + data.csId;

    router.push(path);
  };
  const columnsData: ColumnConfig<CustomerCs>[] = [
    {
      accessorKey: 'csId',
      label: 'id',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'csStatus',
      label: '문의 진행 상황',
      options: 'filtered',
      filteredValues: ['WAITING', 'ANSWERED'],
      onClick: userTitleClick,
    },
    {
      accessorKey: 'question',
      label: '질문',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'answer',
      label: '답변',
      options: 'sorted',
    },
  ];
  const columns: ColumnDef<CustomerCs>[] = TableColumnsCreate(columnsData);
  const processedData: CustomerCs[] = useMemo(() => {
    return data?.data.map(
      (cs: Cs): CustomerCs => ({
        ...cs,
        answer: cs.answer ? cs.answer : '',
      })
    );
  }, [data?.data]);
  const table: ReactTable<CustomerCs> = useReactTable({
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
    return <Loading />;
  }
  return (
    <div className="w-full h-full p-4">
      <ChartTemplate title="CS 문의 차트" table={table} columnsData={columnsData} />
    </div>
  );
};

export default CsChart;
