import { useState } from "react";
import { Calendar, ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { ActivityLogStatisticsCards } from "../components/ActivityLogStatisticsCards";
import { useActivityLogs } from "../hooks/useActivityLogs";
import {
  useActivityLogStats,
  useWeeklyActivityLogStats,
} from "../hooks/useActivityLogStats";
import { useUserStats } from "@/features/users/hooks/users/useUserStats";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import Unauthorized from "@/app/pages/Unauthorized";
import ErrorState from "@/app/pages/ErrorState";
import type { ActivityLogUiPeriod } from "@/types";

export const ActivityLogsPage = () => {
  const [period, setPeriod] = useState<ActivityLogUiPeriod>("all");

  const { data, isPending, isError, refetch } = useActivityLogs(period);
  const { data: statsData, isPending: isStatsPending } = useActivityLogStats();
  const { data: weeklyData, isPending: isWeeklyPending } = useWeeklyActivityLogStats();
  const { data: userStatsData } = useUserStats();
  const canView = usePermission(ACTIONS.VIEW_ACTIVITY_LOGS);

  if (!canView) return <Unauthorized />;

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const stats = statsData?.data;
  const weeklyStats = weeklyData?.data?.weekly_activity_statistics;
  const activeUsersCount = userStatsData?.data?.active_users_count ?? 0;

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
            <span className="text-foreground">سجل النشاط</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            سجل النشاط
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            تتبّع كل العمليات التي تتم على الأرشيف ومن قام بها ومتى
          </p>
        </div>

        <Select
          dir="rtl"
          value={period}
          onValueChange={(val) => setPeriod(val as ActivityLogUiPeriod)}
        >
          <SelectTrigger className="h-11 w-[160px] rounded-xl bg-card border-border px-3.5 text-xs font-bold gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-2 truncate">
              <Calendar className="size-4 text-muted-foreground shrink-0" />
              <SelectValue placeholder="الفترة الزمنية" />
            </div>
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="all">كل الأوقات</SelectItem>
            <SelectItem value="today">اليوم</SelectItem>
            <SelectItem value="week">آخر 7 أيام</SelectItem>
            <SelectItem value="month">آخر 30 يوماً</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="flex flex-col h-[300px] items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground animate-pulse text-sm">
            جاري جلب سجلات النشاط...
          </p>
        </div>
      ) : (
        <>
          <ActivityLogStatisticsCards
            stats={stats}
            weeklyStats={weeklyStats}
            activeUsersCount={activeUsersCount}
            fallbackTotal={data?.data?.length ?? 0}
            isPending={isStatsPending || isWeeklyPending}
          />

          <DataTable
            columns={columns}
            data={data?.data || []}
            events={data?.meta?.events}
          />
        </>
      )}
    </div>
  );
};
