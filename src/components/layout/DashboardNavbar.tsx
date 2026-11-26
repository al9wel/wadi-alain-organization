import { useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === ROUTES.DASHBOARD.SETTINGS) {
      return "الإعدادات";
    }
    if (location.pathname === ROUTES.DASHBOARD.USERS) {
      return "المستخدمون";
    }
    if (location.pathname === ROUTES.DASHBOARD.ACTIVITY_LOGS) {
      return "سجل النشاط";
    }
    if (location.pathname === ROUTES.DASHBOARD.DEPARTMENTS) {
      return "الأقسام";
    }
    return "لوحة التحكم الرئيسية";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 sm:px-6 backdrop-blur-md transition-colors" dir="rtl">
      <div className="flex items-center gap-3">
        {/* Official shadcn Sidebar Trigger on mobile */}
        <SidebarTrigger className="md:hidden" />

        <div>
          <h2 className="font-extrabold text-foreground text-base sm:text-lg leading-tight">
            {getPageTitle()}
          </h2>
          <p className="hidden sm:block text-[11px] text-muted-foreground">
            منظومة إدارة الأرشيف والمشاريع الرقمية
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Chip */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs select-none">
            {user?.name?.charAt(0) || "م"}
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
              {user?.name || "مدير النظام"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
              {user?.department || user?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
