import { AlertCircle, Loader2 } from "lucide-react";
import { DataTable } from "../../components/users/data-table";
import { columns } from "../../components/users/columns";
import { useUsers } from "../../hooks/users/useUsers";
import { useUserStats } from "../../hooks/users/useUserStats";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import Unauthorized from "@/app/pages/Unauthorized";
import ErrorState from "@/app/pages/ErrorState";

export const UsersPage = () => {
  const { data, isPending, isError, refetch } = useUsers();
  const { data: statsData } = useUserStats();
  const canView = usePermission(ACTIONS.VIEW_USERS);

  if (!canView) return <Unauthorized />;

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isPending) {
    return (
      <div className="flex flex-col h-[300px] items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground animate-pulse text-sm">
          جاري جلب المستخدمين...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-[var(--feedback-warning-bg)] border border-[var(--feedback-warning-border)]/70 rounded-2xl p-4 flex items-start gap-3 text-[var(--feedback-warning-fg)]">
        <AlertCircle className="size-5 shrink-0 text-[#cd9933] mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          إيقاف المستخدم يمنعه من تسجيل الدخول فوراً دون حذف بياناته أو ملفاته،
          ويمكن إعادة تفعيله في أي وقت. يستطيع المستخدم الانتماء لأكثر من قسم بدور مختلف في كل قسم.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        stats={statsData?.data}
      />
    </div>
  );
};
