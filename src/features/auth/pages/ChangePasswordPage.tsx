import { Navigate, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function ChangePasswordPage() {
  const { mustChangePassword, tempUser, clearPendingPasswordChange } = useAuth();
  const navigate = useNavigate();

  // If user has neither a pending token nor temporary user state, bounce back to login
  if (!mustChangePassword && !tempUser) {
    return <Navigate to={ROUTES.PUBLIC.AUTH} replace />;
  }

  const handleBackToLogin = () => {
    clearPendingPasswordChange();
    navigate(ROUTES.PUBLIC.AUTH, { replace: true });
  };

  const handleSuccess = () => {
    navigate(ROUTES.PUBLIC.PASSWORD_CHANGED, { replace: true });
  };

  return (
    <AuthLayout showBackLink={false}>
      <ResetPasswordForm
        onSuccess={handleSuccess}
        onBackToLogin={handleBackToLogin}
      />
    </AuthLayout>
  );
}
