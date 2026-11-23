import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User as UserIcon,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import type { CreateUserRequest } from "@/types";

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
