import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDepartments } from "../hooks/useDepartments";
import { useDepartmentStats } from "../hooks/useDepartmentStats";
import { DepartmentsTable } from "../components/DepartmentsTable";
import { DepartmentStatisticsCards } from "../components/DepartmentStatisticsCards";
import { CreateDepartmentDialog } from "../components/CreateDepartmentDialog";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import Unauthorized from "@/app/pages/Unauthorized";
import ErrorState from "@/app/pages/ErrorState";

export const DepartmentsPage = () => {
  const { data: departments, isPending, isError, refetch } = useDepartments();
  const { data: statsData, isPending: isStatsPending } = useDepartmentStats();
  const canView = usePermission(ACTIONS.VIEW_DEPARTMENTS);

  if (!canView) return <Unauthorized />;

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const stats = statsData?.data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-1">
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

        <CreateDepartmentDialog />
      </div>

      {isPending ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">جاري جلب الأقسام...</p>
        </div>
      ) : (
        <>
          <DepartmentStatisticsCards
            stats={stats}
            fallbackTotal={departments?.data?.length ?? 0}
            isPending={isStatsPending}
          />

          <div className="bg-[var(--feedback-warning-bg)] border border-[var(--feedback-warning-border)]/70 rounded-2xl p-4 flex items-start gap-3 text-[var(--feedback-warning-fg)]">
            <AlertCircle className="size-5 shrink-0 text-[#cd9933] mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              عند إيقاف قسم تتوقف جميع العمليات داخله (الرفع، التعديل، المشاركة، الحذف) لكل المستخدمين،
              وتبقى الملفات محفوظة ويمكن استئناف القسم في أي وقت.
            </p>
          </div>

          <DepartmentsTable departments={departments?.data || []} stats={stats} />
        </>
      )}
    </div>
  );
};
