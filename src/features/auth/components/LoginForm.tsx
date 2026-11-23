import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";
import { normalizeUser } from "@/types";
import { useLogin } from "../hooks/useLogin";

interface LoginFormProps {
  onForgotPassword?: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const navigate = useNavigate();
  const { setUser, setPendingPasswordChange } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_name: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.data.must_change_password) {
          setPendingPasswordChange(response.data.token, response.data.user);
          toast.info(response.message || "يرجى تغيير كلمة المرور للمتابعة");
          if (onForgotPassword) {
            onForgotPassword();
          } else {
            navigate(ROUTES.PUBLIC.CHANGE_PASSWORD);
          }
          return;
        }

        const normalized = normalizeUser(response.data.user);
        setUser(normalized, response.data.token);
        toast.success(response.message || "تم تسجيل الدخول بنجاح");
        navigate(ROUTES.DASHBOARD.ROOT, { replace: true });
      },
      onError: (error: Error) => {
        toast.error(error.message || "فشل تسجيل الدخول، يرجى التأكد من البيانات المدخلة");
      },
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="space-y-2 text-right">
        <h1 className="text-2xl sm:text-[28px] font-extrabold text-foreground tracking-tight">
          تسجيل الدخول
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          أدخل بيانات حسابك للمتابعة إلى لوحة التحكم
        </p>
      </div>

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="user_name"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  اسم المستخدم أو رقم الهاتف
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={loginMutation.isPending}
                      placeholder="أدخل اسم المستخدم أو رقم الهاتف"
                      className="h-12 pl-4 pr-11 bg-card border-border rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <UserIcon className="size-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 font-medium" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-bold text-foreground">
                    كلمة المرور
                  </FormLabel>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={loginMutation.isPending}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 pl-11 pr-11 bg-card border-border rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Lock className="size-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? (
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

          {/* Remember Me Checkbox */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2.5 space-y-0 text-right">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loginMutation.isPending}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md size-4"
                  />
                </FormControl>
                <FormLabel className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  تذكر تسجيل دخولي
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>دخول النظام</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
