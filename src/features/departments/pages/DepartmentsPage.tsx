import { useState, useTransition } from "react";
import { AlertCircle, ChevronLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Unauthorized } from "@/app/pages/Unauthorized";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { DepartmentsTable } from "../components/DepartmentsTable";
import { DepartmentKpiCards } from "../components/DepartmentKpiCards";
import { CreateDepartmentDialog } from "../components/CreateDepartmentDialog";
import { useDepartmentStats } from "../hooks/useDepartmentStats";

export function DepartmentsPage() {
  const [search, setSearch] = useState("");
  const [, startTransition] = useTransition();

  const canView = usePermission(ACTIONS.VIEW_DEPARTMENTS);
  const { data: statsData, isLoading: isLoadingStats } = useDepartmentStats();

  if (!canView) return <Unauthorized />;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    startTransition(() => {
      setSearch(val);
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
            <Link
              to={ROUTES.DASHBOARD.ROOT}
              className="hover:text-primary transition-colors"
            >
              الإدارة
            </Link>
            <ChevronLeft className="size-3 text-muted-foreground/60" />
            <span className="text-foreground">الأقسام</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            الأقسام
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            أنشئ أقسام المؤسسة وأدرها، وأوقف أي قسم لتعطيل كل عملياته دفعة واحدة
          </p>
        </div>

        {/* Header Actions: Search + Self-Contained Create Dialog */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-[260px] lg:w-[280px]">
            <Input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="ابحث عن قسم..."
              className="h-11 pl-4 pr-10 text-xs rounded-xl bg-card border-border shadow-2xs"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search className="size-4" />
            </div>
          </div>

          <CreateDepartmentDialog />
        </div>
      </div>

      {/* KPI Row (3 Cards) */}
      <DepartmentKpiCards
        stats={statsData?.data}
        isLoading={isLoadingStats}
      />

      {/* Info / Notice Banner */}
      <div className="bg-[var(--feedback-warning-bg)] border border-[var(--feedback-warning-border)]/70 rounded-2xl p-4 flex items-start gap-3 text-[var(--feedback-warning-fg)]">
        <AlertCircle className="size-5 shrink-0 text-[#cd9933] mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          عند إيقاف قسم تتوقف جميع العمليات داخله (الرفع، التعديل، المشاركة، الحذف) لكل المستخدمين،
          وتبقى الملفات محفوظة ويمكن استئناف القسم في أي وقت.
        </p>
      </div>

      {/* Departments Card List */}
      <DepartmentsTable
        search={search}
        stats={statsData?.data}
      />
    </div>
  );
}
