'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { debounce } from 'next/dist/server/utils';
import { Column, Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ColumnConfig } from '@/app/(afterLogin)/products/components/itemsChart';

type TableProps<TData> = {
  table: Table<TData>;
  columnsData: ColumnConfig<TData>[];
};

/**
 * 테이블에 원하는 컬럼을 지정해서 검색기능을 사용할 수 있게 하는 컴포넌트입니다.
 * @param table
 * @param columns
 * @constructor
 */
export function TableAllFilter<TData>({ table, columnsData }: Readonly<TableProps<TData>>) {
  const [useFilterLabel, setUseFilterLabel] = useState<string>('선택한 컬럼');
  const [userFilterValue, setUserFilterValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  /**
   * 검색기능 debounce 적용
   */
  const onChangeEvent = React.useCallback(
    debounce((value: string) => {
      if (!userFilterValue) return;
      table.getColumn(userFilterValue)?.setFilterValue(value);
    }, 800),
    [table, userFilterValue, inputValue]
  );

  useEffect(() => {
    onChangeEvent(inputValue);
  }, [inputValue]);

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            {useFilterLabel}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().map((column: Column<TData>) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.id === userFilterValue}
              onCheckedChange={() => {
                const newLabel: string = columnsData.find(
                  (c: ColumnConfig<TData>): boolean => c.accessorKey === column.id
                )?.label as string;
                setUserFilterValue(column.id);
                setUseFilterLabel(newLabel);
                setInputValue('');
                table.getColumn(column.id)?.setFilterValue('');
              }}
            >
              {
                columnsData.find((c: ColumnConfig<TData>): boolean => c.accessorKey === column.id)
                  ?.label
              }
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        placeholder="을(를) 필터링 합니다"
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          setInputValue(value);
        }}
        className="max-w-sm"
      />
    </div>
  );
}
