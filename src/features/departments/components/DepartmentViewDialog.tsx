import { Building, Calendar, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Department } from "@/types";

interface DepartmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

export function DepartmentViewDialog({
  open,
  onOpenChange,
  department,
}: DepartmentViewDialogProps) {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  variant={department.is_active ? "outline" : "secondary"}
                  className={
                    department.is_active
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "text-muted-foreground"
                  }
                >
                  {department.is_active ? "قسم نشط" : "قسم موقوف"}
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
