import { useState } from "react";
import { SquarePen, User as UserIcon } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { useUpdateUser } from "@/features/users/hooks/users/useUpdateUser";
import { UserForm } from "@/features/users/components/users/UserForm";
import { normalizeUser, type BackendUser, type UpdateUserRequest } from "@/types";

interface EditProfileDialogProps {
  profile: BackendUser;
}

export const EditProfileDialog = ({ profile }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const { token, setUser } = useAuth();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleUpdate = (data: UpdateUserRequest) => {
    updateUser(
      { id: profile.id, data },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم تحديث الملف الشخصي بنجاح");
          if (res.data) {
            setUser(normalizeUser(res.data), token);
          }
          setOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر تحديث الملف الشخصي");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="h-11 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <SquarePen className="size-4" />
          <span>تعديل الملف الشخصي</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[640px] p-6 sm:p-8 rounded-3xl" dir="rtl">
        <DialogHeader className="space-y-3 text-right">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <UserIcon className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                تعديل الملف الشخصي
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                تحديث بياناتك الشخصية ومعلومات التواصل والقسم
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <UserForm
          initialData={profile}
          onSubmit={handleUpdate}
          onCancel={() => setOpen(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
