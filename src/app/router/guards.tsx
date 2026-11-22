import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Unauthorized } from "@/app/pages/Unauthorized";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: readonly string[] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.PUBLIC.AUTH} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD.ROOT} replace />;
  }

  return <Outlet />;
}
