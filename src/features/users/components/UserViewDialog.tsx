import { Phone, Mail, Building, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BackendUser } from "@/types";

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: BackendUser | null;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
}: UserViewDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-6 rounded-3xl" dir="rtl">
        <DialogHeader className="text-right space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black text-xl shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-foreground">
                {user.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={user.is_active ? "outline" : "secondary"}
                  className={
                    user.is_active
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "text-muted-foreground"
                  }
                >
                  {user.is_active ? "حساب نشط" : "حساب غير نشط"}
                </Badge>
                {user.must_change_password && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600 text-[10px]">
                    بانتظار تغيير كلمة المرور
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-3 border-t border-border/80">
          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="size-3.5" />
                رقم الهاتف (اسم الدخول)
              </span>
              <span className="font-bold text-foreground font-mono" dir="ltr">
                {user.phone || user.user_name}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5" />
                البريد الإلكتروني
              </span>
              <span className="font-bold text-foreground" dir="ltr">
                {user.email || "غير محدد"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Building className="size-3.5" />
                القسم التابع له
              </span>
              <span className="font-bold text-foreground">
                {user.department?.name || "بدون قسم"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                تاريخ الإنشاء
              </span>
              <span className="font-bold text-foreground">
                {user.created_at ? new Date(user.created_at).toLocaleDateString("ar-YE") : "غير متوفر"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5" />
                آخر تسجيل دخول
              </span>
              <span className="font-bold text-foreground">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleDateString("ar-YE")
                  : "لم يسجل دخول بعد"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-11 rounded-xl border-border font-bold text-xs mt-2"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
