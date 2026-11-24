import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { UserStatisticsCards } from "../components/UserStatisticsCards";
import { CreateUserDialog } from "../components/CreateUserDialog";
import { useUsers } from "../hooks/useUsers";
import { useUserStats } from "../hooks/useUserStats";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import Unauthorized from "@/app/pages/Unauthorized";
import ErrorState from "@/app/pages/ErrorState";

export const UsersPage = () => {
  const { data, isPending, isError, refetch } = useUsers();
  const { data: statsData, isPending: isStatsPending } = useUserStats();
  const canView = usePermission(ACTIONS.VIEW_USERS);

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
            <span className="text-foreground">المستخدمون</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            المستخدمون
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            أضف مستخدمين وحدّد أقسامهم وأدوارهم، وأوقف أي حساب عند الحاجة
          </p>
        </div>

        <CreateUserDialog />
      </div>

      {isPending ? (
        <div className="flex flex-col h-[300px] items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground animate-pulse text-sm">جاري جلب المستخدمين...</p>
        </div>
      ) : (
        <>
          <UserStatisticsCards
            stats={stats}
            fallbackTotal={data?.data?.length ?? 0}
            isPending={isStatsPending}
          />

          <div className="bg-[var(--feedback-warning-bg)] border border-[var(--feedback-warning-border)]/70 rounded-2xl p-4 flex items-start gap-3 text-[var(--feedback-warning-fg)]">
            <AlertCircle className="size-5 shrink-0 text-[#cd9933] mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              إيقاف المستخدم يمنعه من تسجيل الدخول فوراً دون حذف بياناته أو ملفاته،
              ويمكن إعادة تفعيله في أي وقت. يستطيع المستخدم الانتماء لأكثر من قسم بدور مختلف في كل قسم.
            </p>
          </div>

          <DataTable columns={columns} data={data?.data || []} stats={stats} />
        </>
      )}
    </div>
  );
};
