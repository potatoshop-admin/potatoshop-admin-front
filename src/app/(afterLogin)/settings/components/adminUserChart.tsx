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
import React, { useState } from 'react';
import { URL } from '@/constants';
import { ColumnConfig } from '@/app/(afterLogin)/products/components/itemsChart';
import { useGetAdminUsers, usePatchManager } from '@/api/adminUser';
import { AdminUser, RoleType } from '@/types/adminUser';
import { toast } from 'sonner';
import ChartTemplate from '@/app/(afterLogin)/components/charts/chartTemplate';

export type CustomAdminUser = {
  adminUserId: number;
  storeId: number;
  name: string;
  logInId: string;
  password: string;
  role: RoleType;
  managerChange: string;
};

const AdminUserChart = () => {
  const router = useRouter();
  const { data, isSuccess } = useGetAdminUsers();
  const { mutate } = usePatchManager({
    onSuccess: (data) => {
      toast.success(data.statusMessage);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userTitleClick = (data: CustomAdminUser) => {
    const path = URL.ORDERS + '/' + data.adminUserId;

    router.push(path);
  };
  const managerChangeClick = (data: CustomAdminUser) => {
    if (data.role === 'STAFF') {
      mutate({ id: Number(data.adminUserId), role: 'MANAGER' });
    } else {
      mutate({ id: Number(data.adminUserId), role: 'STAFF' });
    }
  };
  const columnsData: ColumnConfig<CustomAdminUser>[] = [
    {
      accessorKey: 'adminUserId',
      label: '유저 번호',
      options: 'sorted',
    },
    {
      accessorKey: 'name',
      label: '이름',
      options: 'sorted',
    },
    {
      accessorKey: 'logInId',
      label: '아이디',
      options: 'sorted',
    },
    {
      accessorKey: 'role',
      label: '권한',
      options: 'sorted',
    },
    {
      accessorKey: 'managerChange',
      label: '',
      onClick: managerChangeClick,
    },
  ];
  const columns: ColumnDef<CustomAdminUser>[] = TableColumnsCreate(columnsData);
  const processedData: CustomAdminUser[] = React.useMemo(() => {
    return data?.data.map(
      (adminUser: AdminUser): CustomAdminUser => ({
        ...adminUser,
        managerChange:
          adminUser.role === 'STAFF'
            ? '매니저 변경'
            : adminUser.role === 'MANAGER'
              ? '매니저 취소'
              : '',
      })
    );
  }, [data?.data]);
  const table: ReactTable<CustomAdminUser> = useReactTable({
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
    <div>
      <ChartTemplate title="설정 페이지" table={table} columnsData={columnsData} />
    </div>
  );
};

export default AdminUserChart;
