import { Users, UserCheck, UserX } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import type { UserStats } from "@/types";

interface UserStatisticsCardsProps {
  stats?: UserStats;
  fallbackTotal?: number;
  isPending?: boolean;
}

export function UserStatisticsCards({
  stats,
  fallbackTotal = 0,
  isPending = false,
}: UserStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
      <KpiCard
        title="إجمالي المستخدمين"
        value={stats?.users_count ?? fallbackTotal}
        subtitle="حسابات الموظفين المسجلة"
        icon={Users}
        variant="navy"
        isLoading={isPending}
      />
      <KpiCard
        title="المستخدمون النشطون"
        value={stats?.active_users_count ?? 0}
        subtitle="حسابات مفعلة وتملك حق الدخول"
        icon={UserCheck}
        variant="success"
        isLoading={isPending}
      />
      <KpiCard
        title="الحسابات الموقوفة"
        value={stats?.inactive_users_count ?? 0}
        subtitle="معطلة مؤقتاً ومحفوظة سجلاتها"
        icon={UserX}
        variant="warning"
        isLoading={isPending}
      />
    </div>
  );
}
