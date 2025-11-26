'use client';

import { useGetAllItems } from '@/api/items';
import { Category, Item, Season } from '@/types/item';
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
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';

type ColumnOption = 'sorted' | 'filtered' | 'default';

export interface ColumnConfig<TData> {
  accessorKey: string;
  label: string;
  options?: ColumnOption;
  filteredValues?: string[];
  onClick?: (data: TData) => void;
}

export type CustomerItem = {
  itemId: number;
  category: Category;
  costPrice: number;
  currentProfitAmount: number;
  currentProfitRateBps: number;
  description: string;
  discountRateBps: number;
  listPrice: number;
  salePrice: number;
  season: Season;
  stock: number;
  title: string;
};
const ItemsChart = ({ chartTitle, season }: { chartTitle: string; season?: Season }) => {
  const router = useRouter();

  const { data, isSuccess } = useGetAllItems({ season });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userTitleClick = (data: CustomerItem) => {
    const path = URL.PRODUCTS + '/' + data.itemId;

    router.push(path);
  };
  const columnsData: ColumnConfig<CustomerItem>[] = [
    {
      accessorKey: 'itemId',
      label: 'id',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'title',
      label: '제품명',
      options: 'sorted',
      onClick: userTitleClick,
    },
    {
      accessorKey: 'description',
      label: '제품 설명',
      options: 'sorted',
    },
    {
      accessorKey: 'stock',
      label: '재고량',
      options: 'sorted',
    },
    {
      accessorKey: 'season',
      label: '제품 시즌',
      options: 'filtered',
      filteredValues: ['CURRENT', 'ARCHIVE'],
    },
    {
      accessorKey: 'costPrice',
      label: 'costPrice',
      options: 'sorted',
    },
    {
      accessorKey: 'listPrice',
      label: 'listPrice',
      options: 'sorted',
    },
    {
      accessorKey: 'salePrice',
      label: 'salePrice',
      options: 'sorted',
    },
    {
      accessorKey: 'currentProfitAmount',
      label: 'currentProfitAmount',
      options: 'sorted',
    },
    {
      accessorKey: 'currentProfitRateBps',
      label: 'currentProfitRateBps',
      options: 'sorted',
    },
    {
      accessorKey: 'discountRateBps',
      label: 'discountRateBps',
      options: 'sorted',
    },
    {
      accessorKey: 'category',
      label: 'category',
      options: 'filtered',
      filteredValues: ['outwear', 'top', 'skirt', 'pants', 'dress', 'acc'],
    },
  ];
  const columns: ColumnDef<CustomerItem>[] = TableColumnsCreate(columnsData);

  const processedData: CustomerItem[] = useMemo(() => {
    return data?.data.map(
      (item: Item): CustomerItem => ({
        ...item,
        description:
          item.description.length > 5 ? item.description.substring(0, 5) : item.description,
      })
    );
  }, [data?.data]);

  const table: ReactTable<CustomerItem> = useReactTable({
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
      <ChartTemplate title={chartTitle} table={table} columnsData={columnsData} />
    </div>
  );
};

export default ItemsChart;
