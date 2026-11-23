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
import { useUsers } from "../hooks/useUsers";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { UsersTableSkeleton } from "./UsersTableSkeleton";
import { UserRowCard } from "./UserRowCard";
import { UserCreateDialog } from "./UserCreateDialog";
import type { BackendUser } from "@/types";
import { cn } from "@/lib/utils";

type StatusTab = "all" | "active" | "inactive";
type UserSortOption = "name" | "newest" | "oldest" | "status";

interface UsersTableProps {
  search?: string;
  counts?: {
    total: number;
    active: number;
    inactive: number;
  };
}

const USER_COLUMNS: ColumnDef<BackendUser>[] = [
  { accessorKey: "name", header: "المستخدم" },
  { accessorKey: "is_active", header: "الحالة" },
  { accessorKey: "created_at", header: "تاريخ الإنشاء" },
];

export function UsersTable({ search = "", counts }: UsersTableProps) {
  const [status, setStatus] = useState<StatusTab>("all");
  const [departmentId, setDepartmentId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<UserSortOption>("name");
  const [pageState, setPageState] = useState<{ search: string; page: number }>({
    search,
    page: 1,
  });
  const page = pageState.search === search ? pageState.page : 1;
  const setPage = (newPage: number) => setPageState({ search, page: newPage });

  const { data: departmentsData } = useDepartments({ per_page: 100 });

  const {
    data: usersData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUsers({
    page,
    per_page: 10,
    status,
    department_id: departmentId !== "all" ? Number(departmentId) : undefined,
    search: search ? search.trim() : undefined,
  });

  const sortedUsers = useMemo(() => {
    const items = [...(usersData?.data ?? [])];
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
  }, [usersData?.data, sortBy]);

  const meta = usersData?.meta;

  const handleTabChange = (newStatus: StatusTab) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value);
    setPage(1);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <DataTable
        columns={USER_COLUMNS}
        data={sortedUsers}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        renderSkeleton={() => <UsersTableSkeleton />}
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
                الكل {counts ? `(${counts.total})` : ""}
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
                نشط {counts ? `(${counts.active})` : ""}
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
                موقوف {counts ? `(${counts.inactive})` : ""}
              </button>
            </div>

            {/* Filter & Sort Selects */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as UserSortOption)}
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

              <Select value={departmentId} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="h-10 min-w-[155px] rounded-xl bg-card border-border text-xs font-bold shadow-none">
                  <SelectValue placeholder="كافة الأقسام" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="all">كافة الأقسام</SelectItem>
                  {departmentsData?.data?.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        renderRow={(row) => <UserRowCard user={row.original} />}
        emptyTitle={
          search || departmentId !== "all" || status !== "all"
            ? "لا توجد نتائج مطابقة"
            : "لم يتم العثور على مستخدمين"
        }
        emptyMessage={
          search || departmentId !== "all" || status !== "all"
            ? "لا توجد نتائج تطابق معايير البحث والفلترة المحددة. جرّب ضبط الفلاتر أو تغيير نص البحث."
            : "لم يتم إضافة أي مستخدمين إلى النظام بعد. اضغط على زر الإضافة لإنشاء أول مستخدم."
        }
        emptyAction={
          <UserCreateDialog
            triggerLabel="إضافة مستخدم جديد"
            triggerClassName="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs flex items-center gap-2 cursor-pointer"
          />
        }
        itemLabel="مستخدماً"
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
