import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface PasswordSuccessProps {
  onBackToLogin?: () => void;
}

export function PasswordSuccess({ onBackToLogin }: PasswordSuccessProps) {
  const navigate = useNavigate();
  const { clearPendingPasswordChange } = useAuth();

  const handleGoToDashboard = () => {
    navigate(ROUTES.DASHBOARD.ROOT, { replace: true });
  };

  const handleBack = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      clearPendingPasswordChange();
      navigate(ROUTES.PUBLIC.AUTH);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-2" dir="rtl">
      {/* Big Green Success Circle */}
      <div className="size-24 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto animate-in zoom-in-90 duration-300 shadow-xs">
        <CheckCircle2 className="size-12 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          تم تحديث كلمة المرور
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          أصبح حسابك محمياً بكلمة المرور الجديدة. يمكنك الآن الدخول إلى لوحة التحكم.
        </p>
      </div>

      {/* Button: View Dashboard */}
      <Button
        type="button"
        onClick={handleGoToDashboard}
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-base transition-all shadow-sm active:scale-[0.99] cursor-pointer"
      >
        عرض لوحة التحكم
      </Button>

      {/* Return to Login */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
      >
        <ArrowRight className="size-3.5" />
        <span>العودة لشاشة الدخول</span>
      </button>
    </div>
  );
}
