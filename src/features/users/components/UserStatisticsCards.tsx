import { Users, UserCheck, UserX, Building } from "lucide-react";
import { KpiCard } from "@/components/common/KpiCard";
import type { BackendUser } from "@/types";

interface UserStatisticsCardsProps {
  users?: BackendUser[];
  isPending?: boolean;
}

export function UserStatisticsCards({ users = [], isPending = false }: UserStatisticsCardsProps) {
  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.filter((u) => !u.is_active).length;
  const departmentsSet = new Set(users.map((u) => u.department?.id).filter(Boolean));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
      <KpiCard
        title="إجمالي المستخدمين"
        value={users.length}
        subtitle="حسابات الموظفين المسجلة"
        icon={Users}
        variant="navy"
        isLoading={isPending}
      />
      <KpiCard
        title="المستخدمون النشطون"
        value={activeCount}
        subtitle="حسابات مفعلة وتملك حق الدخول"
        icon={UserCheck}
        variant="success"
        isLoading={isPending}
      />
      <KpiCard
        title="الحسابات الموقوفة"
        value={inactiveCount}
        subtitle="معطلة مؤقتاً ومحفوظة سجلاتها"
        icon={UserX}
        variant="warning"
        isLoading={isPending}
      />
      <KpiCard
        title="الأقسام المربوطة"
        value={departmentsSet.size || "—"}
        subtitle="أقسام ينتمي إليها موظفون"
        icon={Building}
        variant="gold"
        isLoading={isPending}
      />
    </div>
  );
}
