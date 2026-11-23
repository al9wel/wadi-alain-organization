import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { useCreateUser } from "../hooks/useCreateUser";
import { UserForm } from "./UserForm";
import { UserPasswordModal } from "./UserPasswordModal";
import type { CreateUserData, CreateUserRequest } from "@/types";

interface UserCreateDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export function UserCreateDialog({
  triggerLabel = "إضافة مستخدم",
  triggerClassName,
}: UserCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [createdResult, setCreatedResult] = useState<CreateUserData | null>(null);

  const canCreate = usePermission(ACTIONS.CREATE_USER);
  const { mutate: createUser, isPending } = useCreateUser();

  if (!canCreate) return null;

  const handleSubmit = (data: CreateUserRequest) => {
    createUser(data, {
      onSuccess: (response) => {
        toast.success(response.message || "تم إنشاء المستخدم بنجاح");
        setOpen(false);
        setCreatedResult(response.data);
      },
      onError: (error: Error) => {
        toast.error(error.message || "تعذر إنشاء المستخدم");
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className={
              triggerClassName ||
              "h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            }
          >
            <UserPlus className="size-4" />
            <span>{triggerLabel}</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[640px] p-6 sm:p-8 rounded-3xl" dir="rtl">
          <DialogHeader className="space-y-3 text-right">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
                <UserPlus className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                  إضافة مستخدم جديد
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  أدخل بيانات الحساب الأساسية لإنشاء المستخدم وتوليد كلمة المرور
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            isLoading={isPending}
          />
        </DialogContent>
      </Dialog>

      <UserPasswordModal
        open={Boolean(createdResult)}
        onOpenChange={(next) => {
          if (!next) setCreatedResult(null);
        }}
        user={createdResult?.user ?? null}
        temporaryPassword={createdResult?.temporary_password}
      />
    </>
  );
}
