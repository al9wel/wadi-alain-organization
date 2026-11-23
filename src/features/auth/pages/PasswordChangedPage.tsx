import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordSuccess } from "../components/PasswordSuccess";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function PasswordChangedPage() {
  const { clearPendingPasswordChange } = useAuth();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    clearPendingPasswordChange();
    navigate(ROUTES.PUBLIC.AUTH, { replace: true });
  };

  return (
    <AuthLayout showBackLink={false}>
      <PasswordSuccess onBackToLogin={handleBackToLogin} />
    </AuthLayout>
  );
}
