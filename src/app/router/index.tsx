import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ChangePasswordPage } from "@/features/auth/pages/ChangePasswordPage";
import { PasswordChangedPage } from "@/features/auth/pages/PasswordChangedPage";
import { MainPage } from "@/features/main/pages/MainPage";
import { DepartmentsPage } from "@/features/departments/pages/DepartmentsPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { Unauthorized } from "@/app/pages/Unauthorized";
import { ErrorState } from "@/app/pages/ErrorState";
import { ProtectedRoute, PublicRoute } from "./guards";

export const router = createBrowserRouter([
  // Landing Page (/)
  {
    path: ROUTES.PUBLIC.ROOT,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },

  // Auth Routes (/auth, /auth/change-password, /auth/password-changed)
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.PUBLIC.AUTH,
        element: <LoginPage />,
      },
      {
        path: ROUTES.PUBLIC.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
      },
      {
        path: ROUTES.PUBLIC.PASSWORD_CHANGED,
        element: <PasswordChangedPage />,
      },
    ],
  },

  // Standalone Unauthorized (/unauthorized)
  {
    path: ROUTES.PUBLIC.UNAUTHORIZED,
    element: <Unauthorized fullScreen />,
  },

  // Protected Dashboard Routes (/dashboard)
  // يسمح لجميع المستخدمين المسجلين بالدخول، ويتم التحكم بالصفحات بواسطة الصلاحيات (RBAC)
  {
    path: ROUTES.DASHBOARD.ROOT,
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <ErrorState />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: ROUTES.DASHBOARD.DEPARTMENTS.split("/").pop(),
            element: <DepartmentsPage />,
          },
          {
            path: ROUTES.DASHBOARD.USERS.split("/").pop(),
            element: <UsersPage />,
          },
          {
            path: ROUTES.DASHBOARD.SETTINGS.split("/").pop(),
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // 404 Not Found
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center p-4 text-center" dir="rtl">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">404</h1>
          <p className="text-muted-foreground mb-4">الصفحة التي تبحث عنها غير موجودة</p>
          <a href={ROUTES.PUBLIC.ROOT} className="text-primary underline">العودة للرئيسية</a>
        </div>
      </div>
    ),
  },
]);
