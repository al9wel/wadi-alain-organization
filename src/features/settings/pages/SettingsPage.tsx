import { usePermission } from "@/hooks/usePermission";
import { useAuth } from "@/hooks/useAuth";
import { ACTIONS } from "@/constants/permissions";
import { ROLE_LABELS } from "@/constants/roles";
import { Unauthorized } from "@/app/pages/Unauthorized";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, CheckCircle2, User } from "lucide-react";

export function SettingsPage() {
  const { user } = useAuth();
  const canViewSettings = usePermission(ACTIONS.VIEW_SETTINGS);

  if (!canViewSettings) {
    return (
      <Unauthorized message="عذراً، ليس لديك صلاحية الوصول إلى صفحة الإعدادات." />
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إعدادات الحساب وتفضيلات النظام
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">معلومات الحساب والصلاحيات</CardTitle>
          </div>
          <CardDescription>
            هذه الصفحة متاحة لجميع المستخدمين الذين يملكون صلاحية (VIEW_SETTINGS) بما في ذلك المستخدم العادي.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-xl border border-border/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role ? ROLE_LABELS[user.role] : "غير محدد"} • {user?.department}
              </p>
            </div>
            <div className="mr-auto flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>مصرح لك بعرض الإعدادات</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
