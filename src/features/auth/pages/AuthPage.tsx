import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogIn, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { ROLES, ROLE_LABELS, type Role } from "@/constants/roles";
import { toast } from "sonner";
import type { User } from "@/types/user";

const mockUsers: Record<Role, User> = {
  [ROLES.ADMIN]: {
    id: "usr_admin_001",
    name: "أحمد بن مسعود",
    email: "admin@wadialain.org",
    role: ROLES.ADMIN,
    department: "الإدارة العامة",
  },
  [ROLES.MANAGER]: {
    id: "usr_mgr_002",
    name: "سالم الكندي",
    email: "manager@wadialain.org",
    role: ROLES.MANAGER,
    department: "إدارة العمليات",
  },
  [ROLES.DATA_ENTRY]: {
    id: "usr_de_003",
    name: "عمر اليافعي",
    email: "data.entry@wadialain.org",
    role: ROLES.DATA_ENTRY,
    department: "الأرشيف والتوثيق",
  },
  [ROLES.USER]: {
    id: "usr_user_004",
    name: "فاطمة العمودي",
    email: "user@wadialain.org",
    role: ROLES.USER,
    department: "خدمة المستفيدين",
  },
};

const rolesList: Role[] = [
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.DATA_ENTRY,
  ROLES.USER,
];

export function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.ADMIN);

  const handleLogin = (role: Role = selectedRole) => {
    const mockUser = mockUsers[role];
    setUser(mockUser, `mock_jwt_token_${role.toLowerCase()}`);
    toast.success(`تم تسجيل الدخول بنجاح كـ ${ROLE_LABELS[role]}`);
    navigate(ROUTES.DASHBOARD.ROOT, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30" dir="rtl">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-3">
              <Building2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-black text-foreground">مؤسسة وادي العين</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              بوابة تسجيل الدخول ومحاكاة الصلاحيات
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                اختر الحساب التجريبي لتسجيل الدخول:
              </label>
              <div className="space-y-2">
                {rolesList.map((role) => {
                  const user = mockUsers[role];
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isSelected ? <ShieldCheck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-tight">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]} • {user.department}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                        {role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              className="w-full h-11 text-base font-bold gap-2 mt-4"
              onClick={() => handleLogin(selectedRole)}
            >
              <LogIn className="h-5 w-5" />
              <span>تسجيل الدخول كـ ({ROLE_LABELS[selectedRole]})</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
