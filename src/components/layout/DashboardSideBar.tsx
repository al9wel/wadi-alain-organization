import { NavLink } from "react-router-dom";
import {
  Home,
  FolderLock,
  Building,
  Shield,
  Users,
  History,
  Trash2,
  Settings,
  User as UserIcon,
  LogOut,
  Loader2,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-context";
import logoImg from "@/assets/logo.png";

interface NavItemConfig {
  title: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAvailable?: boolean;
  end?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItemConfig[];
}

export function DashboardSideBar() {
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: "القائمة الرئيسية",
      items: [
        {
          title: "الرئيسية",
          path: ROUTES.DASHBOARD.ROOT,
          icon: Home,
          isAvailable: true,
          end: true,
        },
        {
          title: "الأرشيف",
          icon: FolderLock,
          badge: "1,284",
          isAvailable: false,
        },
        {
          title: "الأقسام",
          path: ROUTES.DASHBOARD.DEPARTMENTS,
          icon: Building,
          badge: "8",
          isAvailable: true,
        },
        {
          title: "الصلاحيات والأدوار",
          icon: Shield,
          isAvailable: false,
        },
      ],
    },
    {
      groupTitle: "الإدارة والنظام",
      items: [
        {
          title: "المستخدمون",
          path: ROUTES.DASHBOARD.USERS,
          icon: Users,
          isAvailable: true,
        },
        {
          title: "سجل النشاط",
          path: ROUTES.DASHBOARD.ACTIVITY_LOGS,
          icon: History,
          isAvailable: true,
        },
        {
          title: "سلة المحذوفات",
          icon: Trash2,
          badge: "3",
          isAvailable: false,
        },
        {
          title: "الإعدادات",
          path: ROUTES.DASHBOARD.SETTINGS,
          icon: Settings,
          isAvailable: true,
          end: false,
        },
      ],
    },
    {
      groupTitle: "الحساب",
      items: [
        {
          title: "الملف الشخصي",
          icon: UserIcon,
          isAvailable: false,
        },
      ],
    },
  ];

  return (
    <Sidebar side="right" collapsible="offcanvas" className="bg-card border-l border-border" dir="rtl">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-surface border border-border flex items-center justify-center p-1 shadow-xs shrink-0">
            <img
              src={logoImg}
              alt="شعار المؤسسة"
              className="size-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="font-extrabold text-[15px] text-foreground leading-tight">
              مؤسسة وادي العين
            </span>
            <span className="font-bold text-xs text-[#8f6b24] dark:text-[#e6cc99] leading-tight">
              نظام الأرشفة والتنمية
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.groupTitle}>
            <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;

                  if (item.isAvailable && item.path) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <NavLink
                          to={item.path}
                          end={item.end}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-bold transition-colors w-full ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-[18px] shrink-0" />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                          )}
                        </NavLink>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        disabled
                        className="text-muted-foreground/60 cursor-not-allowed hover:bg-transparent"
                        title="قريباً في التحديثات القادمة"
                      >
                        <Icon className="size-[18px] shrink-0 text-muted-foreground/50" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Profile & Logout Footer */}
      <SidebarFooter className="border-t border-border p-4 space-y-3 bg-card">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs select-none">
            {user?.name?.charAt(0) || "م"}
          </div>
          <div className="truncate flex-1">
            <p className="text-sm font-bold text-foreground truncate">{user?.name || "مدير النظام"}</p>
            <p className="text-xs text-muted-foreground font-medium truncate">
              {user?.department || user?.role || "ADMIN"}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={logoutMutation.isPending}
          className="w-full justify-center gap-2 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold rounded-xl cursor-pointer"
          onClick={handleLogout}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span>تسجيل الخروج</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
