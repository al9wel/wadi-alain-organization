import { Building, CheckCircle2, PauseCircle } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import type { DepartmentStats } from "@/types";

interface DepartmentStatisticsCardsProps {
  stats?: DepartmentStats;
  fallbackTotal?: number;
  isPending?: boolean;
}

export function DepartmentStatisticsCards({
  stats,
  fallbackTotal = 0,
  isPending = false,
}: DepartmentStatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
      <KpiCard
        title="إجمالي الأقسام"
        value={stats?.departments_count ?? fallbackTotal}
        subtitle="كافة أقسام المؤسسة المعتمدة"
        icon={Building}
        variant="navy"
        isLoading={isPending}
      />
      <KpiCard
        title="الأقسام النشطة"
        value={stats?.active_departments_count ?? 0}
        subtitle="تعمل بكامل الصلاحيات والعمليات"
        icon={CheckCircle2}
        variant="success"
        isLoading={isPending}
      />
      <KpiCard
        title="الأقسام الموقوفة"
        value={stats?.inactive_departments_count ?? 0}
        subtitle="معطلة مؤقتاً ومحفوظة ملفاتها"
        icon={PauseCircle}
        variant="warning"
        isLoading={isPending}
      />
    </div>
  );
}
