import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROLE_LABELS } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Unauthorized } from "@/app/pages/Unauthorized";

export function MainPage() {
  const { user } = useAuth();

  // التحقق من صلاحيات العرض الخاصة بالصفحة الرئيسية
  const canView = usePermission(ACTIONS.VIEW_MAIN);
  const canCreate = usePermission(ACTIONS.CREATE_MAIN);
  const canUpdate = usePermission(ACTIONS.UPDATE_MAIN);
  const canDelete = usePermission(ACTIONS.DELETE_MAIN);

  if (!canView) {
    return (
      <Unauthorized message="عذراً، ليس لديك صلاحية العرض (VIEW_MAIN) المطلوبة للوصول إلى الصفحة الرئيسية. يمكنك الانتقال إلى صفحة الإعدادات من القائمة الجانبية." />
    );
  }

  const handleCreate = () => {
    if (canCreate) {
      toast.success("عملية الإضافة: لديك الصلاحية وتمت المحاكاة بنجاح");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية الإضافة (CREATE)");
    }
  };

  const handleUpdate = () => {
    if (canUpdate) {
      toast.success("عملية التعديل: لديك الصلاحية وتمت المحاكاة بنجاح");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية التعديل (UPDATE)");
    }
  };

  const handleDelete = () => {
    if (canDelete) {
      toast.success("عملية الحذف: لديك الصلاحية وتمت المحاكاة بنجاح");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية الحذف (DELETE)");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">الرئيسية</h1>
        <p className="text-sm text-muted-foreground mt-1">
          لوحة التحكم ومحاكاة الصلاحيات وعمليات النظام
        </p>
      </div>

      {/* بطاقة محاكاة الصلاحيات واختبار العمليات */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">محاكاة الصلاحيات (RBAC Simulation)</CardTitle>
          </div>
          <CardDescription>
            المستخدم الحالي: <span className="font-semibold text-foreground">{user?.name}</span> ({user?.role ? ROLE_LABELS[user.role] : "غير محدد"}) — القسم: <span className="font-semibold text-foreground">{user?.department}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* حالة الصلاحيات للمستخدم الحالي */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/40 rounded-xl border border-border/50 text-sm">
            <div className="flex items-center justify-between p-2 rounded-lg bg-background">
              <span className="font-medium text-muted-foreground">صلاحية العرض:</span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> متاح
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-background">
              <span className="font-medium text-muted-foreground">صلاحية الإضافة:</span>
              {canCreate ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> متاح
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                  <XCircle className="h-4 w-4" /> محجوب
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-background">
              <span className="font-medium text-muted-foreground">صلاحية التعديل:</span>
              {canUpdate ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> متاح
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                  <XCircle className="h-4 w-4" /> محجوب
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-background">
              <span className="font-medium text-muted-foreground">صلاحية الحذف:</span>
              {canDelete ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> متاح
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-500">
                  <XCircle className="h-4 w-4" /> محجوب
                </span>
              )}
            </div>
          </div>

          {/* أزرار العمليات المطلوبة للاختبار */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              اختبار العمليات (اضغط لإظهار إشعار التوست حسب الصلاحية):
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleCreate}
                className="gap-2 font-bold"
              >
                <PlusCircle className="h-4 w-4" />
                <span>إضافة (Create)</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleUpdate}
                className="gap-2 font-bold"
              >
                <Pencil className="h-4 w-4" />
                <span>تعديل (Update)</span>
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="gap-2 font-bold"
              >
                <Trash2 className="h-4 w-4" />
                <span>حذف (Delete)</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
