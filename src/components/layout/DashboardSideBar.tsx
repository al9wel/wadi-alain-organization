import { NavLink, useNavigate } from "react-router-dom";
import { Home, Settings, LogOut, Building2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  {
    title: "الرئيسية",
    path: ROUTES.DASHBOARD.ROOT,
    icon: Home,
    end: true,
  },
  {
    title: "الإعدادات",
    path: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
    end: false,
  },
];

export function DashboardSideBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("تم تسجيل الخروج بنجاح");
    navigate(ROUTES.PUBLIC.ROOT, { replace: true });
  };

  return (
    <aside className="w-64 border-l border-border bg-card flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm text-foreground">
            مؤسسة وادي العين
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {user?.name?.charAt(0) || "م"}
          </div>
          <div className="truncate flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user?.name || "مدير النظام"}</p>
            <p className="text-xs text-muted-foreground font-medium">{user?.role || "ADMIN"}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </aside>
  );
}
