'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TableBottomPaginationProps<TData> = {
  table: Table<TData>;
  pageSize: number[];
};

export function TableBottomPagination<TData>({
  table,
  pageSize,
}: TableBottomPaginationProps<TData>) {
  const pageCount: number = table.getPageCount(); // 전체 페이지 개수
  const currentPage: number = table.getState().pagination.pageIndex; // 현재 페이지 (0-based)

  return (
    <div className="flex flex-col font-12-medium sm:font-[16px] sm:flex-row items-center justify-end space-x-2 py-4">
      <div className="flex">
        <Select
          defaultValue={table.getState().pagination.pageSize.toString()}
          onValueChange={(number: number | string) => {
            table.setPageIndex(0);
            table.setPageSize(Number(number));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="보기옵션 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSize.map((size: number) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} 개씩 보기
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          variant="ghost"
          size="sm"
        >
          첫 페이지
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          이전
        </Button>
        <p className="sm:font-[14px] px-2">
          {currentPage} / {pageCount - 1}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          다음
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          마지막 페이지
        </Button>
      </div>
    </div>
  );
}
