import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User as UserIcon,
  UserPlus,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermission } from "@/hooks/usePermission";
import { ACTIONS } from "@/constants/permissions";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useCreateUser } from "../hooks/useCreateUser";
import type { CreateUserData, CreateUserRequest } from "@/types";

const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المستخدم مطلوب")
    .max(255, "اسم المستخدم يجب ألا يتجاوز 255 حرفاً"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .max(20, "رقم الهاتف يجب ألا يتجاوز 20 خانة")
    .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  email: z
    .string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(255, "البريد الإلكتروني يجب ألا يتجاوز 255 حرفاً")
    .optional()
    .or(z.literal("")),
  department_id: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface UserFormProps {
  onSubmit: (data: CreateUserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm = ({ onSubmit, onCancel, isLoading = false }: UserFormProps) => {
  const { data: departmentsData, isLoading: isLoadingDepts } = useDepartments();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      department_id: "none",
      is_active: true,
    },
  });

  const handleFormSubmit = (values: CreateUserFormValues) => {
    onSubmit({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email ? values.email.trim() : null,
      department_id:
        values.department_id && values.department_id !== "none"
          ? Number(values.department_id)
          : null,
      is_active: values.is_active,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-2" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  الاسم الكامل <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="مثال: سالم باوزير"
                      className="h-11 pl-4 pr-10 text-sm rounded-xl bg-card border-border"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <UserIcon className="size-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  رقم الهاتف (اسم المستخدم) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="770000000"
                      dir="ltr"
                      className="h-11 pl-4 pr-10 text-sm rounded-xl bg-card border-border text-right"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Phone className="size-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  البريد الإلكتروني (اختياري)
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      type="email"
                      placeholder="user@wadialain.org"
                      dir="ltr"
                      className="h-11 pl-4 pr-10 text-sm rounded-xl bg-card border-border text-right"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <Mail className="size-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  القسم التابع له (اختياري)
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || isLoadingDepts}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-card border-border text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="size-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="اختر القسم..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="none">بدون قسم</SelectItem>
                      {departmentsData?.data?.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="border border-border/80 rounded-2xl p-4 bg-muted/20 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <FormLabel className="text-sm font-bold text-foreground cursor-pointer">
                    تفعيل الحساب فور الإنشاء
                  </FormLabel>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    سيُطلب من المستخدم تغيير كلمة المرور عند أول تسجيل دخول للنظام.
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-11 px-5 rounded-xl border-border font-bold text-sm cursor-pointer"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin ml-2" />
                <span>جاري الإنشاء...</span>
              </>
            ) : (
              <span>إضافة المستخدم</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const CreateUserDialog = () => {
  const [open, setOpen] = useState(false);
  const [createdResult, setCreatedResult] = useState<CreateUserData | null>(null);
  const [copied, setCopied] = useState(false);

  const canCreate = usePermission(ACTIONS.CREATE_USER);
  const { mutate: createUser, isPending } = useCreateUser();

  if (!canCreate) return null;

  const handleSubmit = (data: CreateUserRequest) => {
    createUser(data, {
      onSuccess: (response) => {
        toast.success(response.message || "تم إنشاء المستخدم بنجاح");
        setOpen(false);
        setCreatedResult(response.data);
      },
      onError: (error: Error) => {
        toast.error(error.message || "تعذر إنشاء المستخدم");
      },
    });
  };

  const handleCopyPassword = () => {
    if (createdResult?.temporary_password) {
      navigator.clipboard.writeText(createdResult.temporary_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="size-4" />
            <span>إضافة مستخدم</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[640px] p-6 sm:p-8 rounded-3xl" dir="rtl">
          <DialogHeader className="space-y-3 text-right">
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-primary shrink-0">
                <UserPlus className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                  إضافة مستخدم جديد
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  أدخل بيانات الحساب الأساسية لإنشاء المستخدم وتوليد كلمة المرور
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            isLoading={isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Temporary Password Dialog */}
      <Dialog
        open={Boolean(createdResult)}
        onOpenChange={(next) => {
          if (!next) {
            setCreatedResult(null);
            setCopied(false);
          }
        }}
      >
        <DialogContent className="max-w-[480px] p-6 sm:p-8 rounded-3xl" dir="rtl">
          <DialogHeader className="text-center sm:text-center space-y-3">
            <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="size-8 stroke-[2.2]" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
              تم إنشاء المستخدم بنجاح
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              تم إنشاء حساب للمستخدم{" "}
              <span className="font-bold text-foreground">{createdResult?.user.name}</span>{" "}
              وتوليد كلمة مرور مؤقتة خاصة به.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="bg-muted/30 border border-border/80 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">اسم المستخدم / الهاتف:</span>
                <span className="font-bold text-foreground font-mono" dir="ltr">
                  {createdResult?.user.phone || createdResult?.user.user_name}
                </span>
              </div>
              {createdResult?.user.department && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">القسم:</span>
                  <span className="font-bold text-foreground">
                    {createdResult.user.department.name}
                  </span>
                </div>
              )}
            </div>

            {createdResult?.temporary_password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-primary" />
                    كلمة المرور المؤقتة
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    صالحة للدخول الأول فقط
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-secondary/50 border border-secondary rounded-2xl">
                  <code
                    className="flex-1 font-mono text-base font-bold text-primary tracking-wider px-2 select-all overflow-x-auto text-left"
                    dir="ltr"
                  >
                    {createdResult.temporary_password}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPassword}
                    className="h-9 px-3 rounded-xl border-border bg-card hover:bg-muted font-bold text-xs shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-600 ml-1" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 ml-1" />
                        نسخ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setCreatedResult(null)}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm cursor-pointer"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
