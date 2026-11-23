import { useState } from "react";
import {
  ArrowLeft,
  Building,
  Eye,
  MoreHorizontal,
  Power,
  SquarePen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { useUpdateDepartment } from "../hooks/useUpdateDepartment";
import { useActivateDepartment } from "../hooks/useActivateDepartment";
import { useDeactivateDepartment } from "../hooks/useDeactivateDepartment";
import { DepartmentForm } from "./DepartmentForm";
import { DepartmentViewDialog } from "./DepartmentViewDialog";
import type { CreateDepartmentRequest, Department } from "@/types";
import { cn } from "@/lib/utils";

interface DepartmentActionsProps {
  department: Department;
}

export function DepartmentActions({ department }: DepartmentActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const canUpdate = usePermission(ACTIONS.UPDATE_DEPARTMENT);
  const { mutate: updateDept, isPending: isUpdating } = useUpdateDepartment();
  const { mutate: activateDept, isPending: isActivating } = useActivateDepartment();
  const { mutate: deactivateDept, isPending: isDeactivating } = useDeactivateDepartment();

  const isActive = department.is_active;
  const isToggling = isActivating || isDeactivating;

  const handleToggleStatus = () => {
    if (isActive) {
      deactivateDept(department.id, {
        onSuccess: (response) => {
          toast.success(response.message || "تم إيقاف القسم بنجاح");
        },
        onError: (error: Error) => {
          toast.error(error.message || "تعذر إيقاف القسم");
        },
      });
    } else {
      activateDept(department.id, {
        onSuccess: (response) => {
          toast.success(response.message || "تم تفعيل القسم بنجاح");
        },
        onError: (error: Error) => {
          toast.error(error.message || "تعذر تفعيل القسم");
        },
      });
    }
  };

  const handleUpdate = (data: CreateDepartmentRequest) => {
    updateDept(
      { id: department.id, data },
      {
        onSuccess: (response) => {
          toast.success(response.message || "تم تحديث بيانات القسم بنجاح");
          setIsEditOpen(false);
        },
        onError: (error: Error) => {
          toast.error(error.message || "تعذر تحديث بيانات القسم");
        },
      }
    );
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
              aria-label={isActive ? "إيقاف القسم" : "تفعيل القسم"}
            />
          </div>
        )}

        {/* Primary CTA Button: فتح القسم */}
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

        {/* Edit Icon Button */}
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

        {/* More Menu Button */}
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
      <DepartmentViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        department={department}
      />

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
    </>
  );
}
