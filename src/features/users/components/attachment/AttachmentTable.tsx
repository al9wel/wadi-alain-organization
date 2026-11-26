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
  User as UserIcon,
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
import { useUsers } from "../../hooks/users/useUsers";
import type { UserAttachment } from "@/types";

interface AttachmentTableProps<TData extends UserAttachment, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AttachmentTable<TData extends UserAttachment, TValue>({
  columns,
  data,
}: AttachmentTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { data: usersData } = useUsers();
  const users = usersData?.data ?? [];

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

      const title = (row.original.name || "").toLowerCase();
      const userName = (row.original.user?.name || "").toLowerCase();
      const uploaderName = (row.original.uploaded_by?.name || "").toLowerCase();

      return (
        title.includes(search) ||
        userName.includes(search) ||
        uploaderName.includes(search)
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

  const selectedUserId =
    (table.getColumn("user")?.getFilterValue() as string) ?? "all";
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <div
      className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 overflow-hidden"
      dir="rtl"
    >
      {/* Toolbar: User Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select
          dir="rtl"
          value={selectedUserId}
          onValueChange={(val) =>
            table.getColumn("user")?.setFilterValue(val === "all" ? undefined : val)
          }
        >
          <SelectTrigger className="h-10 sm:w-[210px] rounded-xl bg-card border-border px-3.5 text-xs font-bold gap-2">
            <div className="flex items-center gap-2 truncate">
              <UserIcon className="size-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="جميع المستخدمين" />
            </div>
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="all">جميع المستخدمين ({data.length})</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="البحث بعنوان الملحق أو اسم المستخدم..."
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-10 pr-10 pl-4 text-xs rounded-xl bg-surface-alt border-border shadow-none"
          />
        </div>
      </div>

      {/* Table (no horizontal overflow on standard viewports) */}
      <div className="w-full [&_[data-slot=table-container]]:overflow-x-clip">
        <Table className="w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-surface-alt hover:bg-surface-alt border-none"
              >
                {headerGroup.headers.map((header, idx) => (
                  <TableHead
                    key={header.id}
                    className={`h-11 px-3.5 text-right text-xs font-bold text-muted-foreground ${
                      idx === 0 ? "rounded-r-xl w-16" : ""
                    } ${
                      idx === headerGroup.headers.length - 1
                        ? "rounded-l-xl text-left w-28"
                        : ""
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
                    <TableCell
                      key={cell.id}
                      className="py-3.5 px-3.5 text-right align-middle whitespace-normal max-w-[240px]"
                    >
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
                      لا توجد ملحقات تطابق بحثك...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
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
            من <span className="font-bold text-foreground">{totalFiltered}</span> ملحق
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
