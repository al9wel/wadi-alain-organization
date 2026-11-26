import { useState } from "react";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  Copy,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Power,
  SquarePen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACTIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useActivateUser } from "../../hooks/users/useActivateUser";
import { useDeactivateUser } from "../../hooks/users/useDeactivateUser";
import { EditUserDialog } from "./EditUserDialog";
import type { BackendUser } from "@/types";
import { cn } from "@/lib/utils";

export const Actions = ({ user }: { user: BackendUser }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const canUpdate = usePermission(ACTIONS.UPDATE_USER);
  const { mutate: activateUser, isPending: isActivating } = useActivateUser();
  const { mutate: deactivateUser, isPending: isDeactivating } = useDeactivateUser();

  const isActive = user.is_active;
  const isToggling = isActivating || isDeactivating;
  const phoneDisplay = user.phone || user.user_name;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneDisplay);
    toast.success("تم نسخ رقم الهاتف بنجاح");
  };

  const handleToggleStatus = () => {
    if (isActive) {
      deactivateUser(user.id, {
        onSuccess: (res) => toast.success(res.message || "تم إيقاف المستخدم بنجاح"),
        onError: (err: Error) => toast.error(err.message || "تعذر إيقاف المستخدم"),
      });
    } else {
      activateUser(user.id, {
        onSuccess: (res) => toast.success(res.message || "تم تفعيل المستخدم بنجاح"),
        onError: (err: Error) => toast.error(err.message || "تعذر تفعيل المستخدم"),
      });
    }
  };

  return (
    <>
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 shrink-0 justify-end">
        {/* Status Toggle Pill */}
        {canUpdate && (
          <div
            className={cn(
              "h-11 px-3.5 rounded-xl flex items-center gap-3 select-none transition-colors",
              isActive
                ? "bg-[#e8f5ee] dark:bg-emerald-950/40"
                : "bg-[#fcebea] dark:bg-red-950/35"
            )}
          >
            <span
              className={cn(
                "text-xs font-extrabold min-w-[34px] text-center",
                isActive
                  ? "text-[#1b7a4b] dark:text-emerald-400"
                  : "text-[#c23b2b] dark:text-red-400"
              )}
            >
              {isActive ? "نشط" : "موقوف"}
            </span>

            <Switch
              checked={isActive}
              disabled={isToggling}
              onCheckedChange={handleToggleStatus}
              aria-label={isActive ? "إيقاف المستخدم" : "تفعيل المستخدم"}
            />
          </div>
        )}

        {/* Primary CTA Button */}
        <Button
          type="button"
          onClick={() => setIsViewOpen(true)}
          className={cn(
            "h-11 px-4 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-none",
            isActive
              ? "bg-primary hover:bg-primary-hover text-primary-foreground"
              : "bg-[#e5e7ef] hover:bg-[#dcdfea] dark:bg-muted/80 dark:hover:bg-muted text-muted-foreground"
          )}
        >
          <span>عرض الحساب</span>
          <ArrowLeft className="size-4" />
        </Button>

        {/* Edit Icon Button */}
        {canUpdate && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            title="تعديل المستخدم"
            className="size-11 rounded-xl border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <SquarePen className="size-4" />
          </Button>
        )}

        {/* More Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="المزيد من الخيارات"
              className="size-11 rounded-xl border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => setIsViewOpen(true)}
              className="gap-2 text-xs font-bold"
            >
              <Eye className="size-3.5 text-muted-foreground" />
              عرض التفاصيل
            </DropdownMenuItem>
            {canUpdate && (
              <>
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  className="gap-2 text-xs font-bold"
                >
                  <SquarePen className="size-3.5 text-muted-foreground" />
                  تعديل المستخدم
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className="gap-2 text-xs font-bold"
                >
                  <Power className="size-3.5 text-muted-foreground" />
                  {isActive ? "إيقاف المستخدم" : "تفعيل المستخدم"}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={handleCopyPhone}
              className="gap-2 text-xs font-bold"
            >
              <Copy className="size-3.5 text-muted-foreground" />
              نسخ رقم الهاتف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
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
                    variant={isActive ? "outline" : "secondary"}
                    className={
                      isActive
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-muted-foreground"
                    }
                  >
                    {isActive ? "حساب نشط" : "حساب موقوف"}
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
                  {phoneDisplay}
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
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("ar-YE")
                    : "غير متوفر"}
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
                    : "لم يسجل الدخول بعد"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewOpen(false)}
              className="w-full h-11 rounded-xl border-border font-bold text-xs mt-2 cursor-pointer"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {canUpdate && (
        <EditUserDialog
          user={user}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
};
