import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { ROUTES } from "@/constants/routes";

export function LoginPage() {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate(ROUTES.PUBLIC.CHANGE_PASSWORD);
  };

  return (
    <AuthLayout showBackLink={true}>
      <LoginForm onForgotPassword={handleForgotPassword} />
    </AuthLayout>
  );
}
