import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Users, Paperclip, ChevronLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ACTIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import Unauthorized from "@/app/pages/Unauthorized";
import { UserStatisticsCards } from "../components/UserStatisticsCards";
import { CreateUserDialog } from "../components/users/CreateUserDialog";
import { CreateAttachmentDialog } from "../components/attachment/CreateAttachmentDialog";
import { useUserStats } from "../hooks/users/useUserStats";
import { cn } from "@/lib/utils";

export const UsersLayout = () => {
  const { pathname } = useLocation();
  const canView = usePermission(ACTIONS.VIEW_USERS);
  const { data: statsData, isPending: isStatsPending } = useUserStats();

  if (!canView) return <Unauthorized />;

  const isAttachmentsActive = pathname.startsWith(ROUTES.DASHBOARD.USER_ATTACHMENTS);
  const isUsersActive =
    pathname.startsWith(ROUTES.DASHBOARD.USERS) && !isAttachmentsActive;

  const mainLinks = [
    {
      title: "المستخدمين",
      path: ROUTES.DASHBOARD.USERS,
      icon: Users,
      isActive: isUsersActive,
    },
    {
      title: "ملحقات المستخدمين",
      path: ROUTES.DASHBOARD.USER_ATTACHMENTS,
      icon: Paperclip,
      isActive: isAttachmentsActive,
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto" dir="rtl">
      {/* Page Header */}
      <div className="space-y-1.5 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
          <Link
            to={ROUTES.DASHBOARD.ROOT}
            className="hover:text-primary transition-colors"
          >
            الإدارة
          </Link>
          <ChevronLeft className="size-3 text-muted-foreground/60" />
          <span className="text-foreground">
            {isAttachmentsActive ? "ملحقات المستخدمين" : "المستخدمون"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {isAttachmentsActive ? "ملحقات المستخدمين" : "المستخدمون"}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isAttachmentsActive
            ? "إدارة واستعراض الوثائق والمرفقات الخاصة بحسابات المستخدمين"
            : "أضف مستخدمين وحدّد أقسامهم وأدوارهم، وأوقف أي حساب عند الحاجة"}
        </p>
      </div>

      {/* Statistics Cards */}
      <UserStatisticsCards stats={statsData?.data} isPending={isStatsPending} />

      {/* Top Sub-Navigation Bar (Right) + Add Action Button (Left) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-card border border-border shadow-xs rounded-2xl self-start sm:self-auto">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === ROUTES.DASHBOARD.USERS}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all text-sm",
                  link.isActive
                    ? "bg-primary text-primary-foreground font-extrabold shadow-xs"
                    : "hover:bg-muted/60 text-muted-foreground hover:text-foreground font-bold"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{link.title}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="self-start sm:self-auto">
          {isAttachmentsActive ? <CreateAttachmentDialog /> : <CreateUserDialog />}
        </div>
      </div>

      {/* Full-Width Sub-route Viewport */}
      <div className="w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
};
