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
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  FolderSearch,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityLog, ActivityLogEventOption } from "@/types";

const DEFAULT_EVENT_OPTIONS: ActivityLogEventOption[] = [
  { value: "created", label: "إنشاء" },
  { value: "updated", label: "تحديث" },
  { value: "deleted", label: "حذف" },
  { value: "activated", label: "تفعيل" },
  { value: "deactivated", label: "إيقاف" },
  { value: "restored", label: "استعادة" },
  { value: "archived", label: "أرشفة" },
  { value: "logged_in", label: "تسجيل دخول" },
  { value: "logged_out", label: "تسجيل خروج" },
  { value: "password_changed", label: "تغيير كلمة المرور" },
  { value: "login_locked", label: "إقفال تسجيل الدخول" },
];

interface DataTableProps<TData extends ActivityLog, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  events?: ActivityLogEventOption[];
}

export function DataTable<TData extends ActivityLog, TValue>({
  columns,
  data,
  events,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.trim().toLowerCase();
      if (!search) return true;

      const userName = (row.original.causer?.name || "النظام").toLowerCase();
      const eventName = (row.original.event || "").toLowerCase();
      const description = (row.original.description || "").toLowerCase();
      const moduleName = (row.original.module || "").toLowerCase();

      return (
        userName.includes(search) ||
        eventName.includes(search) ||
        description.includes(search) ||
        moduleName.includes(search)
      );
    },
    state: {
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const eventOptions = events && events.length > 0 ? events : DEFAULT_EVENT_OPTIONS;
  const activeEventFilter =
    (table.getColumn("event")?.getFilterValue() as string) ?? "all";
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <section
      className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
      dir="rtl"
    >
      {/* Card Header: Titles (Right) + Search & Event Filter (Left) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1 text-right">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            آخر العمليات
          </h2>
          <p className="text-xs font-bold text-muted-foreground">
            أحدث ما تم تسجيله على النظام
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Local Event Filter (نوع العملية) */}
          <Select
            dir="rtl"
            value={activeEventFilter}
            onValueChange={(val) =>
              table.getColumn("event")?.setFilterValue(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="h-10 sm:w-[175px] rounded-xl bg-card border-border px-3.5 text-xs font-bold gap-2">
              <div className="flex items-center gap-2 truncate">
                <Filter className="size-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="نوع العملية" />
              </div>
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="all">نوع العملية (الكل)</SelectItem>
              {eventOptions.map((option) => (
                <SelectItem key={option.value} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Local Search Input */}
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث عن مستخدم أو عملية..."
              value={globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="h-10 pr-10 pl-3 text-xs rounded-xl bg-surface-alt border-border shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-surface-alt hover:bg-surface-alt border-none"
              >
                {headerGroup.headers.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    className={`h-11 px-4 text-right text-xs font-bold text-muted-foreground ${
                      idx === 0 ? "rounded-r-xl" : ""
                    } ${
                      idx === headerGroup.headers.length - 1 ? "rounded-l-xl w-12" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/80 hover:bg-secondary/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-4 text-right align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="size-14 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
                      <FolderSearch className="size-7 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">
                      لا توجد بيانات تطابق بحثك...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer (same pattern as Users DataTable) */}
      {totalFiltered > 0 && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            عرض{" "}
            <span className="font-bold text-foreground">
              {pageIndex * pageSize + 1}
            </span>{" "}
            –{" "}
            <span className="font-bold text-foreground">
              {Math.min((pageIndex + 1) * pageSize, totalFiltered)}
            </span>{" "}
            من <span className="font-bold text-foreground">{totalFiltered}</span> عملية
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
    </section>
  );
}
