import { useState } from "react";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  Calendar,
  Eye,
  Info,
  Loader2,
  MoreHorizontal,
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
  DialogDescription,
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
import { useUpdateDepartment } from "../hooks/useUpdateDepartment";
import { useActivateDepartment } from "../hooks/useActivateDepartment";
import { useDeactivateDepartment } from "../hooks/useDeactivateDepartment";
import { DepartmentForm } from "./DepartmentForm";
import type { CreateDepartmentRequest, Department } from "@/types";
import { cn } from "@/lib/utils";

interface DepartmentActionsProps {
  department: Department;
}

interface ConfirmDeactivateState {
  message: string;
  activeUsersCount: number;
}

export const DepartmentActions = ({ department }: DepartmentActionsProps) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState<ConfirmDeactivateState | null>(null);

  const canUpdate = usePermission(ACTIONS.UPDATE_DEPARTMENT);
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartment();
  const { mutate: activateDept, isPending: isActivating } = useActivateDepartment();
  const { mutate: deactivateDept, isPending: isDeactivating } = useDeactivateDepartment();

  const isActive = department.is_active;
  const isToggling = isActivating || isDeactivating;

  const handleToggleStatus = () => {
    if (isActive) {
      deactivateDept(
        { id: department.id, confirm: false },
        {
          onSuccess: (res) => toast.success(res.message || "تم إيقاف القسم بنجاح"),
          onError: (err: Error) => {
            if (isAxiosError(err)) {
              const errData = err.response?.data as {
                message?: string;
                errors?: {
                  code?: string;
                  requires_confirmation?: boolean;
                  active_users_count?: number;
                };
              } | undefined;

              if (
                errData?.errors?.requires_confirmation ||
                errData?.errors?.code === "DEPARTMENT_HAS_ACTIVE_USERS"
              ) {
                setConfirmDeactivate({
                  message:
                    errData.message ||
                    "هذا القسم يحتوي على موظفين نشطين. سيتم إيقاف القسم مع جميع الموظفين التابعين له، يرجى التأكيد للمتابعة.",
                  activeUsersCount: errData.errors.active_users_count ?? 0,
                });
                return;
              }
            }
            toast.error(err.message || "تعذر إيقاف القسم");
          },
        }
      );
    } else {
      activateDept(department.id, {
        onSuccess: (res) => toast.success(res.message || "تم تفعيل القسم بنجاح"),
        onError: (err: Error) => toast.error(err.message || "تعذر تفعيل القسم"),
      });
    }
  };

  const handleConfirmDeactivate = () => {
    deactivateDept(
      { id: department.id, confirm: true },
      {
        onSuccess: (res) => {
          setConfirmDeactivate(null);
          toast.success(res.message || "تم إيقاف القسم بنجاح");
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر إيقاف القسم");
        },
      }
    );
  };

  const handleUpdate = (data: CreateDepartmentRequest) => {
    updateDept(
      { id: department.id, data },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم تحديث بيانات القسم بنجاح");
          setIsEditOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر تحديث بيانات القسم");
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 shrink-0 justify-end">
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
              aria-label={isActive ? "إيقاف القسم" : "تفعيل القسم"}
            />
          </div>
        )}

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
          <span>فتح القسم</span>
          <ArrowLeft className="size-4" />
        </Button>

        {canUpdate && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsEditOpen(true)}
            title="تعديل القسم"
            className="size-11 rounded-xl border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <SquarePen className="size-4" />
          </Button>
        )}

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
                  تعديل القسم
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className="gap-2 text-xs font-bold"
                >
                  <Power className="size-3.5 text-muted-foreground" />
                  {isActive ? "إيقاف القسم" : "تفعيل القسم"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-[480px] p-6 rounded-3xl" dir="rtl">
          <DialogHeader className="text-right space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="size-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
                <Building className="size-7" />
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold text-foreground">
                  {department.name}
                </DialogTitle>
                <div className="mt-1">
                  <Badge
                    variant={isActive ? "outline" : "secondary"}
                    className={
                      isActive
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "text-muted-foreground"
                    }
                  >
                    {isActive ? "قسم نشط" : "قسم موقوف"}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 pt-3 border-t border-border/80">
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1.5 font-bold">
                  <Info className="size-3.5" />
                  الوصف
                </span>
                <p className="text-foreground leading-relaxed">
                  {department.description || "لا يوجد وصف مسجل لهذا القسم."}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  تاريخ الإنشاء
                </span>
                <span className="font-bold text-foreground">
                  {department.created_at
                    ? new Date(department.created_at).toLocaleDateString("ar-YE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "غير متوفر"}
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
        <Dialog open={isEditOpen} onOpenChange={(next) => !isUpdating && setIsEditOpen(next)}>
          <DialogContent className="max-w-[560px] p-6 sm:p-8 rounded-3xl" dir="rtl">
            <DialogHeader className="space-y-3 text-right">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
                  <Building className="size-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                    تعديل بيانات القسم
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    تحديث اسم ووصف أو حالة القسم في الهيكل المؤسسي
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <DepartmentForm
              initialData={department}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditOpen(false)}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Deactivate Department With Active Users Dialog */}
      <Dialog
        open={Boolean(confirmDeactivate)}
        onOpenChange={(next) => {
          if (!next && !isDeactivating) setConfirmDeactivate(null);
        }}
      >
        <DialogContent className="max-w-[480px] p-6 sm:p-7 rounded-3xl" dir="rtl">
          <DialogHeader className="text-right space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground">
                  تأكيد إيقاف القسم
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  قسم: {department.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-xs sm:text-sm leading-relaxed text-foreground font-medium">
              {confirmDeactivate?.message}
            </div>

            {confirmDeactivate && confirmDeactivate.activeUsersCount > 0 && (
              <p className="text-xs text-muted-foreground">
                عدد الموظفين النشطين المتأثرين:{" "}
                <span className="font-extrabold text-destructive">
                  {confirmDeactivate.activeUsersCount}
                </span>
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDeactivate(null)}
                disabled={isDeactivating}
                className="h-11 px-5 rounded-xl border-border font-bold text-xs sm:text-sm cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDeactivate}
                disabled={isDeactivating}
                className="h-11 px-5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2"
              >
                {isDeactivating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>جاري الإيقاف...</span>
                  </>
                ) : (
                  <span>تأكيد إيقاف القسم والموظفين</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
