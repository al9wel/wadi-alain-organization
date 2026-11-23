import * as React from "react";
import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
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
import { ChevronRight, ChevronLeft, AlertCircle, RefreshCw, FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: React.ReactNode;
  renderRow?: (row: Row<TData>) => React.ReactNode;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  renderSkeleton?: () => React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  pagination?: DataTablePaginationProps;
  itemLabel?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  renderRow,
  isLoading = false,
  isFetching = false,
  isError = false,
  errorMessage,
  onRetry,
  renderSkeleton,
  emptyTitle = "لا توجد سجلات",
  emptyMessage = "لم يتم العثور على أي نتائج في قاعدة البيانات.",
  emptyAction,
  pagination,
  itemLabel = "عنصراً",
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-3xl overflow-hidden shadow-xs relative",
        className
      )}
      dir="rtl"
    >
      {/* Background Refetch subtle progress line (Keeps existing data visible) */}
      {isFetching && !isLoading && (
        <div className="h-0.5 w-full bg-secondary overflow-hidden absolute top-0 left-0 right-0 z-10">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      )}

      {/* Top Toolbar matching Figma Card Header */}
      {toolbar && (
        <div
          className={cn(
            "p-4 sm:px-6 bg-card",
            renderRow ? "pt-5 pb-4" : "border-b border-border/80 sm:py-4"
          )}
        >
          {toolbar}
        </div>
      )}

      {/* 1. ERROR STATE */}
      {isError ? (
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              فشل تحميل البيانات
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              {errorMessage || "حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من الاتصال والمحاولة مرة أخرى."}
            </p>
          </div>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-9 px-4 rounded-xl border-border font-bold text-xs mt-2 gap-1.5 cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>إعادة المحاولة</span>
            </Button>
          )}
        </div>
      ) : isLoading ? (
        /* 2. INITIAL LOADING STATE (Table Skeleton) */
        renderSkeleton ? (
          renderSkeleton()
        ) : (
          <div className="p-6 space-y-4">
            <div className="h-10 bg-muted/40 rounded-xl animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted/20 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        )
      ) : data.length === 0 ? (
        /* 3. EMPTY STATE */
        <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-16 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
            <FolderSearch className="size-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-foreground">
              {emptyTitle}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {emptyMessage}
            </p>
          </div>
          {emptyAction && <div className="pt-2">{emptyAction}</div>}
        </div>
      ) : (
        /* 4. SUCCESS DATA TABLE / CARD LIST */
        <div>
          {renderRow ? (
            <div className="px-4 sm:px-6 pb-5 pt-1 space-y-3">
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/20 dark:bg-muted/10 border-b border-border/80">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-border/80 hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-right text-xs font-bold text-muted-foreground py-4 px-6 whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-border/60 hover:bg-muted/15 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4 px-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Footer matching Figma */}
          {pagination && pagination.total > 0 && (
            <div
              className={cn(
                "px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-card",
                !renderRow && "border-t border-border/80"
              )}
            >
              <div>
                عرض{" "}
                <span className="font-bold text-foreground">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>{" "}
                –{" "}
                <span className="font-bold text-foreground">
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                </span>{" "}
                من <span className="font-bold text-foreground">{pagination.total}</span> {itemLabel}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground ml-2">
                    الصفحة {pagination.page} من {pagination.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => pagination.onPageChange(Math.max(pagination.page - 1, 1))}
                    className="h-8 px-2.5 rounded-lg border-border text-xs font-bold cursor-pointer"
                  >
                    <ChevronRight className="size-4 ml-1" />
                    السابق
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                    className="h-8 px-2.5 rounded-lg border-border text-xs font-bold cursor-pointer"
                  >
                    التالي
                    <ChevronLeft className="size-4 mr-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
