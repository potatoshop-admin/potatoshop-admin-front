import React from 'react';
import { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { ColumnConfig } from '@/app/(afterSignIn)/components/tables/total-data-table';
import { FilterableHeader, SortableHeader } from '@/components/table/column-factory';

const TableCellComponent = React.memo(
  ({ value, onClick }: { value: string; onClick?: () => void }) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          'capitalize font-14-regular text-gray-700',
          typeof onClick === 'function' && 'cursor-pointer'
        )}
      >
        {value}
      </div>
    );
  }
);
TableCellComponent.displayName = 'TableCellComponent';

/**
 * 테이블의 뼈대를 구성하는 컴포넌트입니다.
 * 구성될 값을 columnsData로 보내주면 header와 cell을 값에 맞게 형성합니다.
 * @param configs
 * @constructor
 */
export function TableColumnsCreate<TData>(configs: ColumnConfig<TData>[]): ColumnDef<TData>[] {
  return configs.map((item: ColumnConfig<TData>) => ({
    accessorKey: item.accessorKey,
    header: ({ column }: HeaderContext<TData, unknown>) => {
      if (item.options === 'sorted') {
        return <SortableHeader label={item.label} column={column} />;
      }
      if (item.options === 'filtered' && item.filteredValues) {
        return (
          <FilterableHeader label={item.label} column={column} options={item.filteredValues} />
        );
      }
      return <span>{item.label}</span>;
    },
    cell: ({ row }: CellContext<TData, unknown>) => {
      const handleClick = item.onClick ? () => item.onClick?.(row.original) : undefined;
      return <TableCellComponent value={row.getValue(item.accessorKey)} onClick={handleClick} />;
    },
  }));
}
