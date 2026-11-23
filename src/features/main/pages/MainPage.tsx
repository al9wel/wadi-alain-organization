import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { ROLE_LABELS } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FolderLock,
  Building,
  Users,
  HardDrive,
  FileText,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { Unauthorized } from "@/app/pages/Unauthorized";

export function MainPage() {
  const { user } = useAuth();

  // Permissions validation
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
      toast.success("عملية الإضافة: لديك الصلاحية المطلوبة (CREATE)");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية الإضافة (CREATE)");
    }
  };

  const handleUpdate = () => {
    if (canUpdate) {
      toast.success("عملية التعديل: لديك الصلاحية المطلوبة (UPDATE)");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية التعديل (UPDATE)");
    }
  };

  const handleDelete = () => {
    if (canDelete) {
      toast.success("عملية الحذف: لديك الصلاحية المطلوبة (DELETE)");
    } else {
      toast.error("عملية مرفوضة: ليس لديك صلاحية الحذف (DELETE)");
    }
  };

  const modules = [
    {
      title: "الأرشيف المركزي",
      status: "مستودع الوثائق جاهز",
      detail: "تنظيم شجرة المجلدات والتصنيفات",
      icon: FolderLock,
    },
    {
      title: "الهيكل الإداري",
      status: "الأقسام والمشرفين",
      detail: "توزيع الصلاحيات حسب التخصص",
      icon: Building,
    },
    {
      title: "المستخدمون والوصول",
      status: "حسابات المستخدمين المعتمدة",
      detail: "تحكم دقيق بمستويات الصلاحيات",
      icon: Users,
    },
    {
      title: "التخزين السحابي",
      status: "خوادم التخزين متصلة",
      detail: "تشفير كامل للوثائق والمرفقات",
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            مرحباً بك، <span className="font-bold text-foreground">{user?.name}</span> — نظرة عامة على حالة النظام والأرشيف المؤسسي
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-secondary text-primary font-bold text-xs self-start sm:self-auto border border-border">
          <Activity className="size-4" />
          <span>حالة المنظومة: متصل ونشط</span>
        </div>
      </div>

      {/* Operational Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.title} className="border-border rounded-2xl shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1 text-right">
                  <p className="text-xs font-bold text-muted-foreground">{mod.title}</p>
                  <p className="text-sm font-extrabold text-foreground">{mod.status}</p>
                  <p className="text-[11px] text-muted-foreground">{mod.detail}</p>
                </div>
                <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* RBAC Verification & Action Testing */}
      <Card className="border-border rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                التحقق من الصلاحيات والعمليات (RBAC)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                المستخدم الحالي: <span className="font-bold text-foreground">{user?.name}</span> ({user?.role ? ROLE_LABELS[user.role] : "غير محدد"}) — القسم: <span className="font-bold text-foreground">{user?.department || "الإدارة العامة"}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Permission Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <span className="font-bold text-muted-foreground">صلاحية العرض:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> مصرح
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <span className="font-bold text-muted-foreground">صلاحية الإضافة:</span>
              {canCreate ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> مصرح
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                  <XCircle className="size-3.5" /> محجوب
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <span className="font-bold text-muted-foreground">صلاحية التعديل:</span>
              {canUpdate ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> مصرح
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                  <XCircle className="size-3.5" /> محجوب
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <span className="font-bold text-muted-foreground">صلاحية الحذف:</span>
              {canDelete ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> مصرح
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-rose-500">
                  <XCircle className="size-3.5" /> محجوب
                </span>
              )}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-foreground">اختبار العمليات المباشرة وفق الصلاحيات الممنوحة:</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={canCreate ? "default" : "secondary"}
                onClick={handleCreate}
                className="gap-2 rounded-xl h-10 px-4 font-bold text-xs cursor-pointer shadow-xs"
              >
                <PlusCircle className="size-4" />
                <span>إضافة ملف جديد (CREATE)</span>
              </Button>

              <Button
                variant={canUpdate ? "outline" : "secondary"}
                onClick={handleUpdate}
                className="gap-2 rounded-xl h-10 px-4 font-bold text-xs cursor-pointer border-border"
              >
                <Pencil className="size-4" />
                <span>تعديل وثيقة (UPDATE)</span>
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
                className="gap-2 rounded-xl h-10 px-4 font-bold text-xs cursor-pointer shadow-xs"
              >
                <Trash2 className="size-4" />
                <span>حذف ملف (DELETE)</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <Card className="border-border rounded-2xl shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <span>أحدث الوثائق المسجلة في النظام</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
              <span className="text-muted-foreground font-mono">PDF</span>
              <span className="font-bold text-foreground">تقرير_المشاريع_الربع_الأول_2026.pdf</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
              <span className="text-muted-foreground font-mono">XLSX</span>
              <span className="font-bold text-foreground">موازنة_المشاريع_التنموية_2026.xlsx</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
              <span className="text-muted-foreground font-mono">DOCX</span>
              <span className="font-bold text-foreground">محضر_اجتماع_مجلس_الإدارة_يناير.docx</span>
            </div>
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card className="border-border rounded-2xl shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <span>سجل النشاطات الأخيرة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <span className="text-muted-foreground font-mono">اليوم</span>
              <span className="font-medium text-foreground">تسجيل دخول ناجح إلى النظام</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <span className="text-muted-foreground font-mono">اليوم</span>
              <span className="font-medium text-foreground">تحميل وثيقة من مجلد الإدارة المالية</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border">
              <span className="text-muted-foreground font-mono">أمس</span>
              <span className="font-medium text-foreground">تحديث بيانات الحساب وتفضيلات النظام</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
