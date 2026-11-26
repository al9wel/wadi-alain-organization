import { useState } from "react";
import {
  AlertTriangle,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  SquarePen,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { attachmentApi } from "../../api/attachmentApi";
import { useAttachment } from "../../hooks/attachment/useAttachment";
import { useUpdateAttachment } from "../../hooks/attachment/useUpdateAttachment";
import { useDeleteAttachment } from "../../hooks/attachment/useDeleteAttachment";
import { AttachmentForm } from "./AttachmentForm";
import type { UserAttachment } from "@/types";

interface AttachmentActionsProps {
  attachment: UserAttachment;
}

export const AttachmentActions = ({ attachment }: AttachmentActionsProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canView = usePermission(ACTIONS.VIEW_USERS);
  const canUpdate = usePermission(ACTIONS.UPDATE_USER);
  const canDelete = usePermission(ACTIONS.DELETE_USER);

  const { data: detailData, isPending: isLoadingDetail } = useAttachment(
    attachment.user_id,
    attachment.id,
    isViewDialogOpen
  );
  const { mutate: updateAttachment, isPending: isUpdating } = useUpdateAttachment();
  const { mutate: deleteAttachment, isPending: isDeleting } = useDeleteAttachment();

  const record = detailData?.data ?? attachment;
  const downloadUrl = attachmentApi.getDownloadUrl(record.file_url);

  const handleUpdate = ({
    userId,
    formData,
  }: {
    userId: number;
    formData: FormData;
  }) => {
    updateAttachment(
      {
        userId,
        attachmentId: attachment.id,
        data: formData,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم تحديث الملحق بنجاح");
          setIsEditDialogOpen(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || "حدث خطأ أثناء تحديث الملحق");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteAttachment(
      {
        userId: attachment.user_id,
        attachmentId: attachment.id,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم حذف الملحق بنجاح");
          setIsDeleteDialogOpen(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || "حدث خطأ أثناء حذف الملحق");
        },
      }
    );
  };

  const infoItems = [
    { label: "رقم الملحق", value: `#${record.id}` },
    { label: "عنوان الملحق", value: record.name },
    { label: "المستخدم", value: record.user?.name || attachment.user?.name || "—" },
    { label: "تم الرفع بواسطة", value: record.uploaded_by?.name || "—" },
    {
      label: "تاريخ الإضافة",
      value: record.created_at
        ? new Date(record.created_at).toLocaleDateString("ar-YE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View Details */}
      {canView && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="عرض تفاصيل الملحق"
              className="size-8 rounded-lg text-primary hover:bg-secondary cursor-pointer"
            >
              <Eye className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] rounded-3xl p-6" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-xl font-extrabold text-foreground">
                تفاصيل الملحق
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                استعراض بيانات المرفق وخيارات المعاينة والتحميل
              </DialogDescription>
            </DialogHeader>

            {isLoadingDetail && !detailData ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>جاري جلب تفاصيل الملحق...</span>
              </div>
            ) : (
              <div className="space-y-3 pt-2 text-right">
                <div className="rounded-2xl border border-border bg-surface-alt/50 divide-y divide-border text-xs">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-muted-foreground font-bold">
                        {item.label}
                      </span>
                      <span className="font-extrabold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {record.file_url && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <Button
                      asChild
                      className="flex-1 h-10 rounded-xl font-bold text-xs gap-2"
                    >
                      <a href={record.file_url} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                        <span>معاينة المرفق</span>
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-10 rounded-xl font-bold text-xs gap-2 border-border"
                    >
                      <a href={downloadUrl} target="_blank" rel="noreferrer">
                        <Download className="size-4" />
                        <span>تحميل المرفق</span>
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Attachment */}
      {canUpdate && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="تعديل الملحق"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer"
            >
              <SquarePen className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[580px] rounded-3xl p-6 sm:p-8" dir="rtl">
            <DialogHeader className="text-right">
              <DialogTitle className="text-xl font-extrabold text-foreground">
                تعديل الملحق
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                تحديث اسم الملحق أو استبدال الملف المرفق
              </DialogDescription>
            </DialogHeader>
            <AttachmentForm
              key={`${attachment.id}-${attachment.updated_at ?? ""}`}
              initialData={{
                name: attachment.name,
                userId: attachment.user_id,
                fileUrl: attachment.file_url,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Attachment */}
      {canDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="حذف الملحق"
              className="size-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl p-6" dir="rtl">
            <DialogHeader className="text-right">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                  <AlertTriangle className="size-5" />
                </div>
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  حذف الملحق
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
                هل أنت متأكد من حذف الملحق{" "}
                <span className="font-extrabold text-foreground">
                  {attachment.name}
                </span>
                ؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-10 px-4 text-xs font-bold cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl h-10 px-5 text-xs font-bold cursor-pointer gap-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span>تأكيد الحذف</span>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
