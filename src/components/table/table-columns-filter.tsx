import React, { JSX } from 'react';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnConfig } from '@/app/(afterLogin)/products/components/itemsChart';

type TableColumnsFilterProps<TData> = {
  table: Table<TData>;
  columnsData: ColumnConfig<TData>[];
};

/**
 * 컬럼을 선택해 선택된 열만 테이블에서 보여지도록 하는 컴포넌트입니다.
 * @param table
 * @param columnsData
 * @constructor
 */
export const TableColumnsFilter = React.memo(function TableColumnsFilter<TData>({
  table,
  columnsData,
}: TableColumnsFilterProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          행 필터
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnsData.find((c) => c.accessorKey === column.id)?.label}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}) as <TData>(props: TableColumnsFilterProps<TData>) => JSX.Element;
