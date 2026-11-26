import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface NotFoundProps {
  message?: string;
  fullScreen?: boolean;
}

export function NotFound({
  message = "عذراً، المسار الذي تحاول الوصول إليه غير موجود أو ربما تم نقله.",
  fullScreen = false,
}: NotFoundProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const homeTarget = isAuthenticated ? ROUTES.DASHBOARD.ROOT : ROUTES.PUBLIC.ROOT;

  return (
    <div
      className={`w-full flex items-center justify-center p-6 text-center ${
        fullScreen ? "min-h-screen bg-background" : "min-h-[400px] my-auto"
      }`}
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-primary">
            <FileQuestion className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            404 - الصفحة غير موجودة
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            className="w-full sm:w-auto gap-2 cursor-pointer"
            onClick={() => navigate(homeTarget)}
          >
            <Home className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto gap-2 cursor-pointer"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(homeTarget);
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

export default NotFound;
