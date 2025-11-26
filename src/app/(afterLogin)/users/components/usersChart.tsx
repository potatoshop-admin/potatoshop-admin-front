'use client';

import React, { useState } from 'react';
import { useGetAllUsers } from '@/api/users';
import { Grade, User } from '@/types/user';
import { URL } from '@/constants';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
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
import {
  TableAllFilter,
  TableBottomPagination,
  TableColumnsCreate,
  TableColumnsFilter,
} from '@/components/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ColumnOption = 'sorted' | 'filtered' | 'default';

export interface ColumnConfig<TData> {
  accessorKey: string;
  label: string;
  options?: ColumnOption;
  filteredValues?: string[];
  // onClick?: (data: Row<TData>) => void;
  onClick?: (data: TData) => void;
}

export type CustomerUser = {
  age: number | null;
  birthday: string | null;
  email: string;
  grade: Grade;
  logInId: string;
  name: string;
  password: string;
  userId: number;
};
const UsersChart = () => {
  const router = useRouter();

  const { data, isSuccess } = useGetAllUsers();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const userNameClick = (data: CustomerUser) => {
    const path = URL.USERS + '/' + data.userId;

    router.push(path);
  };
  const columnsData: ColumnConfig<CustomerUser>[] = [
    {
      accessorKey: 'userId',
      label: 'id',
      options: 'sorted',
    },
    {
      accessorKey: 'name',
      label: '이름',
      options: 'sorted',
      onClick: userNameClick,
    },
    {
      accessorKey: 'logInId',
      label: '아이디',
      options: 'sorted',
    },
    {
      accessorKey: 'grade',
      label: '등급',
      options: 'filtered',
      filteredValues: ['BASIC', 'BLACK', 'VIP'],
    },
    {
      accessorKey: 'email',
      label: '이메일',
      options: 'sorted',
    },
    {
      accessorKey: 'age',
      label: '나이',
      options: 'sorted',
    },
    {
      accessorKey: 'birthday',
      label: '생일',
      options: 'sorted',
    },
  ];
  const columns: ColumnDef<CustomerUser>[] = TableColumnsCreate(columnsData);
  //가공해야 할 데이터들이 있으면 해당 방식으로 해결
  const processedData: CustomerUser[] = React.useMemo(() => {
    return data?.data.map(
      (user: User): CustomerUser => ({
        ...user,
        birthday: user.birthday === null ? '' : user.birthday,
        age: user.age === null ? 0 : user.age,
      })
    );
  }, [data?.data]);
  const table: ReactTable<CustomerUser> = useReactTable({
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
      <div className="h-fit border-2 border-gray-200 rounded-2xl px-4 py-4 overflow-y-scroll">
        <div className="w-full h-fit">
          <h1 className="font-24-extrabold sm:text-[28px]">users</h1>
        </div>
        <div className="flex items-center py-4">
          <TableAllFilter table={table} columnsData={columnsData} />
          <TableColumnsFilter table={table} columnsData={columnsData} />
        </div>
        <div className="overflow-hidden rounded-md border-2 border-gray-200">
          <Table>
            <TableHeader className="bg-primary-50 hover:bg-primary-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center">No results.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TableBottomPagination table={table} pageSize={[10, 30, 50]} />
      </div>
    </div>
  );
};

export default UsersChart;
