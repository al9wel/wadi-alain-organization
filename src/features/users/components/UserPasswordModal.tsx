import { useState } from "react";
import { CheckCircle2, Copy, Check, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BackendUser } from "@/types";

interface UserPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: BackendUser | null;
  temporaryPassword?: string;
}

export function UserPasswordModal({
  open,
  onOpenChange,
  user,
  temporaryPassword,
}: UserPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (temporaryPassword) {
      navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <span className="font-bold text-foreground">{user?.name}</span> وتوليد
            كلمة مرور مؤقتة خاصة به.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* User Details Mini Card */}
          <div className="bg-muted/30 border border-border/80 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">اسم المستخدم / الهاتف:</span>
              <span className="font-bold text-foreground font-mono" dir="ltr">
                {user?.phone || user?.user_name}
              </span>
            </div>
            {user?.department && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">القسم:</span>
                <span className="font-bold text-foreground">
                  {user.department.name}
                </span>
              </div>
            )}
          </div>

          {/* Temporary Password Box */}
          {temporaryPassword ? (
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
                  {temporaryPassword}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-9 px-3 rounded-xl border-border bg-card hover:bg-muted font-bold text-xs shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-600 ml-1.5" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 ml-1.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-muted/40 rounded-xl text-center text-xs text-muted-foreground">
              تم إرسال بيانات الدخول إلى المستخدم
            </div>
          )}

          {/* Notice Alert */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed text-right">
            يرجى نسخ كلمة المرور ومشاركتها مع المستخدم. سيُجبر النظام المستخدم على
            إنشاء كلمة مرور جديدة خاصة به عند أول تسجيل دخول.
          </div>

          {/* Close button */}
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm cursor-pointer"
          >
            تم، إغلاق النافذة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
