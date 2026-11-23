import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSideBar } from "./DashboardSideBar";
import { DashboardNavbar } from "./DashboardNavbar";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors" dir="rtl">
        {/* Official shadcn/ui Sidebar */}
        <DashboardSideBar />

        {/* Main Content Area */}
        <SidebarInset>
          <DashboardNavbar />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
