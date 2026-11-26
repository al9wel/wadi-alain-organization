import { User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUser } from "../../hooks/users/useUpdateUser";
import { UserForm } from "./UserForm";
import type { BackendUser, UpdateUserRequest } from "@/types";

interface EditUserDialogProps {
  user: BackendUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditUserDialog = ({ user, open, onOpenChange }: EditUserDialogProps) => {
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleUpdate = (data: UpdateUserRequest) => {
    updateUser(
      { id: user.id, data },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم تحديث بيانات المستخدم بنجاح");
          onOpenChange(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر تحديث بيانات المستخدم");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-[640px] p-6 sm:p-8 rounded-3xl" dir="rtl">
        <DialogHeader className="space-y-3 text-right">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <UserIcon className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                تعديل بيانات المستخدم
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                تحديث البيانات الأساسية أو القسم التابع له المستخدم
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <UserForm
          initialData={user}
          onSubmit={handleUpdate}
          onCancel={() => onOpenChange(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
