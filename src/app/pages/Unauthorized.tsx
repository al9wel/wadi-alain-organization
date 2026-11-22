import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowRight, Home } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface UnauthorizedProps {
  message?: string;
  fullScreen?: boolean;
}

export function Unauthorized({
  message = "عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أن هذا خطأ.",
  fullScreen = false,
}: UnauthorizedProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full flex items-center justify-center p-6 text-center ${
        fullScreen ? "min-h-screen bg-background" : "min-h-[400px] my-auto"
      }`}
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            403 - وصول غير مصرح
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            className="w-full sm:w-auto gap-2"
            onClick={() => navigate(ROUTES.DASHBOARD.ROOT)}
          >
            <Home className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(ROUTES.DASHBOARD.ROOT);
              }
            }}
          >
            <ArrowRight className="h-4 w-4" />
            <span>الرجوع للخلف</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
