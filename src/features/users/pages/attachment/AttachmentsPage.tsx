import { Loader2 } from "lucide-react";
import ErrorState from "@/app/pages/ErrorState";
import Unauthorized from "@/app/pages/Unauthorized";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { useAttachments } from "../../hooks/attachment/useAttachments";
import { AttachmentTable } from "../../components/attachment/AttachmentTable";
import { columns } from "../../components/attachment/columns";

export const AttachmentsPage = () => {
  const { data: attachments, isPending, isError, refetch } = useAttachments();
  const canView = usePermission(ACTIONS.VIEW_USERS);

  if (!canView) return <Unauthorized />;

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      {isPending ? (
        <div className="flex flex-col h-[280px] items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground animate-pulse text-sm">
            جاري جلب ملحقات المستخدمين...
          </p>
        </div>
      ) : (
        <AttachmentTable columns={columns} data={attachments?.data || []} />
      )}
    </div>
  );
};
