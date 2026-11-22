import { Outlet } from "react-router-dom";
import { DashboardSideBar } from "./DashboardSideBar";
import { DashboardNavbar } from "./DashboardNavbar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      <DashboardSideBar />
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
