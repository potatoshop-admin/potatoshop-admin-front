'use client';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface HeaderProps<TData> {
  label: string;
  column: Column<TData>;
  options: string[];
}

/**
 * 컬럼의 헤더 중 sort 기능을 넣어줄 때 사용하는 컴포넌트
 * @param label
 * @param column
 * @constructor
 */
export function SortableHeader<TData>({ label, column }: Omit<HeaderProps<TData>, 'options'>) {
  return (
    <Button
      variant="ghost"
      size="table"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

/**
 * 컬럼의 헤더 중 filter 기능을 넣어줄 때 사용하는 컴포넌트
 * dropdown 컴포넌트에 보여줄 filter 조건들을 보여주기 위헤 options 파라미터를 보내줍니다.
 * filter가 active 된 상태에는 버튼 색이 강조 됩니다.
 * @param label
 * @param column
 * @param options
 * @constructor
 */
export function FilterableHeader<TData>({ label, column, options }: HeaderProps<TData>) {
  const activeFilter = column.getFilterValue() || '';
  return (
    <div className="flex items-center space-x-2">
      <p>{label}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn('h-8 w-8 p-0', activeFilter !== '' && 'bg-primary-100')}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className={cn(activeFilter === '' && 'bg-primary-100')}
            onClick={() => column.setFilterValue('')}
          >
            전체
          </DropdownMenuItem>
          {options.map((val: string) => (
            <DropdownMenuItem
              className={cn(activeFilter === val && 'bg-primary-100')}
              key={val}
              onClick={() => column.setFilterValue(val)}
            >
              {val}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
