import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Unauthorized } from "@/app/pages/Unauthorized";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: readonly string[] }) {
  const { isAuthenticated, user, mustChangePassword } = useAuth();

  // If user is required to change password first, redirect to change password route
  if (mustChangePassword) {
    return <Navigate to={ROUTES.PUBLIC.CHANGE_PASSWORD} replace />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.PUBLIC.AUTH} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated, mustChangePassword } = useAuth();

  if (isAuthenticated && !mustChangePassword) {
    return <Navigate to={ROUTES.DASHBOARD.ROOT} replace />;
  }

  return <Outlet />;
}
