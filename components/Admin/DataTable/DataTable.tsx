"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  // ✅ Pagination props
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // ✅ Search props
  search?: string;
  onSearch?: (value: string) => void;
  onDeleteSelected?: (ids: string[]) => void;
  getRowId?: (row: T) => string;
  isRowSelectable?: (row: T) => boolean;
};

export default function DataTable<T>({
  columns,
  data,
  loading,
  page = 1,
  totalPages = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  search,
  onSearch,
  onDeleteSelected,
  getRowId,
  isRowSelectable,
}: Props<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const checkboxColumn: ColumnDef<T> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => {
      if (isRowSelectable && !isRowSelectable(row.original)) {
        return null;
      }
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
  };
  const allColumns = onDeleteSelected ? [checkboxColumn, ...columns] : columns;
  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
  });
  const selectedIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id],
  );
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)
    ) {
      onDeleteSelected?.(selectedIds);
      setRowSelection({});
    }
  };
  return (
    <div className="space-y-4 mt-4 border rounded-2xl p-4">
      {/* ✅ Search */}
      <div className="flex justify-between items-center">
        {onSearch && (
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="border border-gray-3 rounded-lg px-4 py-2 outline-none focus:border-blue w-full max-w-xs"
          />
        )}
        <div className="flex items-center gap-3 ml-auto">
          {selectedIds.length > 0 && onDeleteSelected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete ({selectedIds.length})
            </Button>
          )}
          <p className="text-sm text-dark-5">
            Total: <span className="font-medium">{total}</span>
          </p>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="rounded-xl border border-gray-3 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  <div className="flex w-full justify-center ">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-5">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | string)[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={i}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(p as number)}
                  >
                    {p}
                  </Button>
                ),
              )}

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
