import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments } from "../hooks/useDepartments";
import { DepartmentsTableSkeleton } from "./DepartmentsTableSkeleton";
import { DepartmentRowCard } from "./DepartmentRowCard";
import { CreateDepartmentDialog } from "./CreateDepartmentDialog";
import type { Department, DepartmentStats } from "@/types";
import { cn } from "@/lib/utils";

type DepartmentStatusTab = "all" | "active" | "inactive";
type DepartmentSortOption = "name" | "newest" | "oldest" | "status";

interface DepartmentsTableProps {
  search?: string;
  stats?: DepartmentStats;
}

const DEPARTMENT_COLUMNS: ColumnDef<Department>[] = [
  { accessorKey: "name", header: "القسم" },
  { accessorKey: "is_active", header: "الحالة" },
  { accessorKey: "created_at", header: "تاريخ الإنشاء" },
];

export function DepartmentsTable({ search = "", stats }: DepartmentsTableProps) {
  const [status, setStatus] = useState<DepartmentStatusTab>("all");
  const [sortBy, setSortBy] = useState<DepartmentSortOption>("name");
  const [pageState, setPageState] = useState<{ search: string; page: number }>({
    search,
    page: 1,
  });
  const page = pageState.search === search ? pageState.page : 1;
  const setPage = (newPage: number) => setPageState({ search, page: newPage });

  const {
    data: deptsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDepartments({
    page,
    per_page: 10,
    status,
    search: search ? search.trim() : undefined,
  });

  const sortedDepartments = useMemo(() => {
    const items = [...(deptsData?.data ?? [])];
    switch (sortBy) {
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      case "newest":
        return items.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
        );
      case "oldest":
        return items.sort(
          (a, b) =>
            new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
        );
      case "status":
        return items.sort((a, b) => Number(b.is_active) - Number(a.is_active));
      default:
        return items;
    }
  }, [deptsData?.data, sortBy]);

  const meta = deptsData?.meta;

  const handleTabChange = (newStatus: DepartmentStatusTab) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <DataTable
        columns={DEPARTMENT_COLUMNS}
        data={sortedDepartments}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        renderSkeleton={() => <DepartmentsTableSkeleton />}
        toolbar={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Segmented Status Tabs */}
            <div className="inline-flex items-center gap-1 p-1 bg-[#f3f3f6] dark:bg-muted/50 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
                  status === "all"
                    ? "bg-card text-primary font-extrabold shadow-xs"
                    : "text-muted-foreground hover:text-foreground font-semibold"
                )}
              >
                الكل {stats ? `(${stats.departments_count})` : ""}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("active")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
                  status === "active"
                    ? "bg-card text-primary font-extrabold shadow-xs"
                    : "text-muted-foreground hover:text-foreground font-semibold"
                )}
              >
                نشطة {stats ? `(${stats.active_departments_count})` : ""}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("inactive")}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
                  status === "inactive"
                    ? "bg-card text-primary font-extrabold shadow-xs"
                    : "text-muted-foreground hover:text-foreground font-semibold"
                )}
              >
                موقوفة {stats ? `(${stats.inactive_departments_count})` : ""}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto shrink-0">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as DepartmentSortOption)}
              >
                <SelectTrigger className="h-10 min-w-[140px] rounded-xl bg-card border-border text-xs font-bold shadow-none">
                  <SelectValue placeholder="ترتيب: الاسم" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="name">ترتيب: الاسم</SelectItem>
                  <SelectItem value="newest">ترتيب: الأحدث</SelectItem>
                  <SelectItem value="oldest">ترتيب: الأقدم</SelectItem>
                  <SelectItem value="status">ترتيب: الحالة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        renderRow={(row) => <DepartmentRowCard department={row.original} />}
        emptyTitle={
          search || status !== "all"
            ? "لا توجد نتائج مطابقة"
            : "لم يتم العثور على أقسام"
        }
        emptyMessage={
          search || status !== "all"
            ? "لا توجد أقسام تطابق معايير البحث والفلترة المحددة."
            : "لم يتم إنشاء أي أقسام في المؤسسة بعد. اضغط على زر الإنشاء لإضافة أول قسم."
        }
        emptyAction={
          <CreateDepartmentDialog
            triggerLabel="إنشاء قسم جديد"
            triggerClassName="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs flex items-center gap-2 cursor-pointer"
          />
        }
        itemLabel="أقسام"
        pagination={
          meta
            ? {
                page: meta.current_page,
                pageSize: meta.per_page,
                total: meta.total,
                totalPages: meta.last_page,
                onPageChange: (newPage) => setPage(newPage),
              }
            : undefined
        }
      />
    </div>
  );
}
