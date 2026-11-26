import { useState } from "react";
import { UserPlus, CheckCircle2, Copy, Check, KeyRound } from "lucide-react";
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
import { useCreateUser } from "../../hooks/users/useCreateUser";
import { UserForm } from "./UserForm";
import type { CreateUserData, CreateUserRequest } from "@/types";

export const CreateUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [createdResult, setCreatedResult] = useState<CreateUserData | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopyPassword = () => {
    if (createdResult?.temporary_password) {
      navigator.clipboard.writeText(createdResult.temporary_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>إضافة مستخدم</span>
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

      {/* Temporary Password Dialog */}
      <Dialog
        open={Boolean(createdResult)}
        onOpenChange={(next) => {
          if (!next) {
            setCreatedResult(null);
            setCopied(false);
          }
        }}
      >
        <DialogContent className="max-w-[480px] p-6 sm:p-8 rounded-3xl" dir="rtl">
          <DialogHeader className="text-center sm:text-center space-y-3">
            <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="size-8 stroke-[2.2]" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
              تم إنشاء المستخدم بنجاح
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              تم إنشاء حساب للمستخدم{" "}
              <span className="font-bold text-foreground">{createdResult?.user.name}</span>{" "}
              وتوليد كلمة مرور مؤقتة خاصة به.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-muted/30 border border-border/80 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">اسم المستخدم / الهاتف:</span>
                <span className="font-bold text-foreground font-mono" dir="ltr">
                  {createdResult?.user.phone || createdResult?.user.user_name}
                </span>
              </div>
              {createdResult?.user.department && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">القسم:</span>
                  <span className="font-bold text-foreground">
                    {createdResult.user.department.name}
                  </span>
                </div>
              )}
            </div>

            {createdResult?.temporary_password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-primary" />
                    كلمة المرور المؤقتة
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    صالحة للدخول الأول فقط
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-secondary/50 border border-secondary rounded-2xl">
                  <code
                    className="flex-1 font-mono text-base font-bold text-primary tracking-wider px-2 select-all overflow-x-auto text-left"
                    dir="ltr"
                  >
                    {createdResult.temporary_password}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPassword}
                    className="h-9 px-3 rounded-xl border-border bg-card hover:bg-muted font-bold text-xs shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-600 ml-1" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 ml-1" />
                        نسخ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setCreatedResult(null)}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm cursor-pointer"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
