import { useState } from "react";
import { Paperclip, Plus } from "lucide-react";
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
import { useCreateAttachment } from "../../hooks/attachment/useCreateAttachment";
import { AttachmentForm } from "./AttachmentForm";

export const CreateAttachmentDialog = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createAttachment, isPending } = useCreateAttachment();
  const canCreate = usePermission(ACTIONS.CREATE_USER);

  if (!canCreate) return null;

  const handleSubmit = ({
    userId,
    formData,
  }: {
    userId: number;
    formData: FormData;
  }) => {
    createAttachment(
      { userId, data: formData },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم رفع الملحق بنجاح");
          setOpen(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || "حدث خطأ أثناء رفع الملحق");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>إضافة ملحق</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[580px] p-6 sm:p-8 rounded-3xl" dir="rtl">
        <DialogHeader className="space-y-3 text-right">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <Paperclip className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                إضافة ملحق جديد
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                اختر المستخدم وارفع الوثيقة أو المرفق الخاص به
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AttachmentForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
