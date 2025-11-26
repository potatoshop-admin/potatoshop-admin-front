import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import { TableAllFilter, TableBottomPagination, TableColumnsFilter } from '@/components/table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnConfig } from '@/app/(afterLogin)/users/components/usersChart';

type ChartTemplateProps<T> = {
  title: string;
  table: ReactTable<T>;
  columnsData: ColumnConfig<T>[];
};

const ChartTemplate = <T,>({ title, table, columnsData }: ChartTemplateProps<T>) => {
  return (
    <div className="h-fit border-2 border-gray-200 rounded-2xl px-4 py-4 overflow-y-scroll">
      <div className="w-full h-fit">
        <h1 className="font-24-extrabold sm:text-[28px]">{title}</h1>
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
  );
};

export default ChartTemplate;
