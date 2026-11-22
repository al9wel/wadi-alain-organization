import { useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function DashboardNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === ROUTES.DASHBOARD.SETTINGS) {
      return "الإعدادات";
    }
    return "الرئيسية";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 px-6 backdrop-blur-md">
      <h2 className="font-bold text-foreground text-base">{getPageTitle()}</h2>
      <div className="text-xs text-muted-foreground">
        {user?.name} ({user?.role})
      </div>
    </header>
  );
}
