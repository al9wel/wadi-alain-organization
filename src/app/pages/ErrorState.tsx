import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorState({
  title = "حدث خطأ غير متوقع",
  message = "تعذر إكمال العملية أو تحميل البيانات المطلوبة. يرجى المحاولة مرة أخرى.",
  onRetry = () => window.location.reload(),
  fullScreen = false,
}: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-6 text-center ${
        fullScreen ? "min-h-screen bg-background" : "min-h-[400px] my-auto"
      }`}
      dir="rtl"
    >
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button
              type="button"
              variant="default"
              onClick={onRetry}
              className="w-full sm:w-auto gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>إعادة المحاولة</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={() => navigate(ROUTES.DASHBOARD.ROOT)}
          >
            <Home className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ErrorState as ErrorPage, ErrorState as Error };
export default ErrorState;
