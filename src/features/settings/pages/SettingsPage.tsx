import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-context";
import { ACTIONS } from "@/constants/permissions";
import { ROLE_LABELS } from "@/constants/roles";
import { Unauthorized } from "@/app/pages/Unauthorized";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, User, Sun, Moon, Laptop, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const canViewSettings = usePermission(ACTIONS.VIEW_SETTINGS);

  if (!canViewSettings) {
    return (
      <Unauthorized message="عذراً، ليس لديك صلاحية الوصول إلى صفحة الإعدادات." />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          الإعدادات
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          إعدادات الحساب الشخصي، المظهر، وتفضيلات النظام
        </p>
      </div>

      {/* 1. Account Info */}
      <Card className="border-border rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
              <User className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">معلومات الحساب</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                البيانات الأساسية والدور الوظيفي المعتمد في المنظومة
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/40 rounded-xl border border-border">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-base shadow-xs select-none">
                {user?.name?.charAt(0) || "م"}
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">{user?.name || "مدير النظام"}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {user?.phone ? `الهاتف: ${user.phone}` : ""} {user?.email ? `• البريد: ${user.email}` : ""}
                </p>
                <p className="text-xs text-[#8f6b24] dark:text-[#e6cc99] font-bold mt-0.5">
                  الدور: {user?.role ? ROLE_LABELS[user.role] : "ADMIN"} • القسم: {user?.department || "الإدارة العامة"}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
              <CheckCircle2 className="size-4" />
              <span>حساب نشط ومصرح</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Theme & Appearance */}
      <Card className="border-border rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
              <Sun className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">مظهر النظام (Theme Mode)</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                اختر المظهر المفضل للواجهة (الوضع الفاتح، الوضع الداكن، أو حسب إعدادات الجهاز)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className={`h-14 rounded-xl justify-start px-4 gap-3 font-bold text-xs cursor-pointer border-border ${
                theme === "light" ? "shadow-xs" : ""
              }`}
            >
              <Sun className="size-5 text-amber-500" />
              <div className="text-right">
                <p>الوضع الفاتح (Light)</p>
                <p className="text-[10px] opacity-80 font-normal">ألوان كلاسيكية ناصعة</p>
              </div>
            </Button>

            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className={`h-14 rounded-xl justify-start px-4 gap-3 font-bold text-xs cursor-pointer border-border ${
                theme === "dark" ? "shadow-xs" : ""
              }`}
            >
              <Moon className="size-5 text-indigo-400" />
              <div className="text-right">
                <p>الوضع الداكن (Dark)</p>
                <p className="text-[10px] opacity-80 font-normal">مريح للعينين ليلاً</p>
              </div>
            </Button>

            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className={`h-14 rounded-xl justify-start px-4 gap-3 font-bold text-xs cursor-pointer border-border ${
                theme === "system" ? "shadow-xs" : ""
              }`}
            >
              <Laptop className="size-5 text-muted-foreground" />
              <div className="text-right">
                <p>تلقائي (System)</p>
                <p className="text-[10px] opacity-80 font-normal">حسب تفضيل نظام التشغيل</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Permissions Matrix Overview */}
      <Card className="border-border rounded-2xl shadow-xs">
        <CardHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-secondary text-primary flex items-center justify-center">
              <Shield className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">صلاحيات الوصول الممنوحة</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                ملخص الصلاحيات المفعلة لحسابك في هذه الجلسة
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
              <span className="font-bold text-foreground">عرض لوحة التحكم:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">مصرح (VIEW_MAIN)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
              <span className="font-bold text-foreground">عرض الإعدادات:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">مصرح (VIEW_SETTINGS)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-secondary/40 border border-border flex items-center justify-between">
              <span className="font-bold text-foreground">حالة تشفير البيانات:</span>
              <span className="text-primary font-bold">مفعل ومحمي</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
