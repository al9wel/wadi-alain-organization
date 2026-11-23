import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Check, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/auth.schemas";
import { normalizeUser } from "@/types";
import { useChangePassword } from "../hooks/useChangePassword";

import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ResetPasswordForm({
  onSuccess,
  onBackToLogin,
}: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const { setUser, tempUser, clearPendingPasswordChange } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    mode: "onChange",
  });

  const watchedPassword = useWatch({
    control: form.control,
    name: "new_password",
    defaultValue: "",
  });

  // Password Policy: ONLY minimum 8 characters is required.
  const hasMinLength = watchedPassword.length >= 8;

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(values, {
      onSuccess: (response) => {
        const normalized = normalizeUser(response.data.user);
        setUser(normalized, response.data.token);
        toast.success(response.message || "تم تغيير كلمة المرور بنجاح");
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(ROUTES.PUBLIC.PASSWORD_CHANGED);
        }
      },
      onError: (error: Error) => {
        toast.error(
          error.message ||
            "تعذر تغيير كلمة المرور، يرجى التحقق من صحة كلمة المرور الحالية"
        );
      },
    });
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
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-1 shadow-xs">
          <Lock className="size-7" />
        </div>

        <h1 className="text-2xl sm:text-[28px] font-extrabold text-foreground tracking-tight">
          أنشئ كلمة مرورك الجديدة
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
          {tempUser
            ? `مرحباً ${tempUser.name}، لأسباب أمنية يجب تعيين كلمة مرور جديدة لحسابك قبل المتابعة.`
            : "لأسباب أمنية، يجب استبدال كلمة المرور المؤقتة قبل المتابعة."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password Field */}
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  كلمة المرور الحالية أو المؤقتة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={changePasswordMutation.isPending}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور الحالية"
                      className="h-12 pl-11 pr-11 bg-card border-border rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Lock className="size-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  كلمة المرور الجديدة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={changePasswordMutation.isPending}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="8 أحرف كحد أدنى"
                      className="h-12 pl-11 pr-11 bg-card border-border rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Lock className="size-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* Requirement indicator (8 chars minimum only) */}
          <div className="pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border/60 text-xs">
              <div
                className={`size-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  hasMinLength
                    ? "bg-emerald-600 text-white"
                    : "bg-muted-foreground/30 text-transparent"
                }`}
              >
                <Check className="size-2.5 stroke-[3]" />
              </div>
              <span className={hasMinLength ? "text-emerald-600 font-bold" : "text-muted-foreground font-medium"}>
                يجب ألا تقل كلمة المرور عن 8 أحرف (يُقبل أي مزيج من الحروف أو الأرقام أو الرموز)
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  تأكيد كلمة المرور الجديدة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={changePasswordMutation.isPending}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="أعد إدخال كلمة المرور"
                      className="h-12 pl-11 pr-11 bg-card border-border rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Lock className="size-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>جاري حفظ كلمة المرور...</span>
              </>
            ) : (
              <span>حفظ وتفعيل الحساب</span>
            )}
          </Button>

          {/* Back to Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={changePasswordMutation.isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
            >
              <ArrowRight className="size-3.5" />
              <span>العودة لشاشة الدخول</span>
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
