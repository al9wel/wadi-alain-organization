import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  FolderSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BackendUser } from "@/types";

interface DataTableProps<TData extends BackendUser, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends BackendUser, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const activeFilter = (table.getColumn("is_active")?.getFilterValue() as string) ?? "all";
  const activeCount = data.filter((u) => u.is_active).length;
  const inactiveCount = data.filter((u) => !u.is_active).length;
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div
      className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs"
      dir="rtl"
    >
      {/* Toolbar: Tabs + Search */}
      <div className="p-4 sm:px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex items-center gap-1 p-1 bg-[#f3f3f6] dark:bg-muted/50 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => table.getColumn("is_active")?.setFilterValue(undefined)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              activeFilter === "all"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            الكل ({data.length})
          </button>
          <button
            type="button"
            onClick={() => table.getColumn("is_active")?.setFilterValue("active")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              activeFilter === "active"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            نشط ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => table.getColumn("is_active")?.setFilterValue("inactive")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              activeFilter === "inactive"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            موقوف ({inactiveCount})
          </button>
        </div>

        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="البحث عن طريق الاسم..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-10 pr-10 pl-4 text-xs rounded-xl bg-card border-border shadow-none"
          />
        </div>
      </div>

      {/* Figma Card Rows List */}
      <div className="px-4 sm:px-6 pb-5 pt-1 space-y-3">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const isActive = row.original.is_active;
            const nameCell = row.getVisibleCells().find((c) => c.column.id === "name");
            const actionsCell = row.getVisibleCells().find((c) => c.column.id === "actions");

            return (
              <div
                key={row.id}
                className={cn(
                  "rounded-[20px] border px-4 py-4 sm:px-5 sm:py-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
                  isActive
                    ? "bg-card border-border hover:border-[#c8c5ba] dark:hover:border-border hover:shadow-xs"
                    : "bg-[#f4f5f8] dark:bg-muted/25 border-border/80"
                )}
              >
                {nameCell && flexRender(nameCell.column.columnDef.cell, nameCell.getContext())}
                {actionsCell &&
                  flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
              </div>
            );
          })
        ) : (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
              <FolderSearch className="size-7 stroke-[1.5]" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">
              لا توجد بيانات تطابق بحثك...
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalFiltered > 0 && (
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            عرض{" "}
            <span className="font-bold text-foreground">
              {pageIndex * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-bold text-foreground">
              {Math.min((pageIndex + 1) * pageSize, totalFiltered)}
            </span>{" "}
            من <span className="font-bold text-foreground">{totalFiltered}</span> مستخدماً
          </div>

          {table.getPageCount() > 1 && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground ml-2">
                صفحة {pageIndex + 1} من {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex rounded-lg cursor-pointer"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex rounded-lg cursor-pointer"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
