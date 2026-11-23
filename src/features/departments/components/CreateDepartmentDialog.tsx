import { useState } from "react";
import { Building, Plus } from "lucide-react";
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
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import { DepartmentForm } from "./DepartmentForm";
import type { CreateDepartmentRequest } from "@/types";

interface CreateDepartmentDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export function CreateDepartmentDialog({
  triggerLabel = "إنشاء قسم جديد",
  triggerClassName,
}: CreateDepartmentDialogProps) {
  const [open, setOpen] = useState(false);

  const canCreate = usePermission(ACTIONS.CREATE_DEPARTMENT);
  const { mutate: createDept, isPending } = useCreateDepartment();

  if (!canCreate) return null;

  const handleSubmit = (data: CreateDepartmentRequest) => {
    createDept(data, {
      onSuccess: (response) => {
        toast.success(response.message || "تم إنشاء القسم بنجاح");
        setOpen(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || "تعذر إنشاء القسم");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={
            triggerClassName ||
            "h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          }
        >
          <Plus className="size-4" />
          <span>{triggerLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[560px] p-6 sm:p-8 rounded-3xl" dir="rtl">
        <DialogHeader className="space-y-3 text-right">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
              <Building className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                إنشاء قسم جديد
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                أضف قسماً جديداً إلى هيكل المؤسسة لإدارة الملفات والمستخدمين
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DepartmentForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
