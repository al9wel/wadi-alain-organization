import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { CreateDepartmentRequest, Department } from "@/types";

const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "اسم القسم مطلوب")
    .max(255, "اسم القسم يجب ألا يتجاوز 255 حرفاً"),
  description: z
    .string()
    .max(1000, "الوصف يجب ألا يتجاوز 1000 حرف")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  initialData?: Department | null;
  onSubmit: (data: CreateDepartmentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const DepartmentForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: DepartmentFormProps) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description ?? "",
        is_active: initialData.is_active,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [initialData, form]);

  const handleFormSubmit = (values: DepartmentFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description ? values.description.trim() : null,
      is_active: values.is_active,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-2" dir="rtl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5 text-right">
              <FormLabel className="text-xs font-bold text-foreground">
                اسم القسم <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                  placeholder="مثال: الحسابات والمالية"
                  className="h-11 px-4 text-sm rounded-xl bg-card border-border"
                />
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1.5 text-right">
              <FormLabel className="text-xs font-bold text-foreground">
                الوصف (اختياري)
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isLoading}
                  placeholder="اكتب نبذة مختصرة عن مهام ومسؤوليات هذا القسم..."
                  rows={3}
                  className="px-4 py-3 text-sm rounded-xl bg-card border-border"
                />
              </FormControl>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

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
                    {initialData ? "القسم نشط ومفعّل" : "تفعيل القسم فور الإنشاء"}
                  </FormLabel>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    يمكنك إيقاف القسم أو إعادة تفعيله لاحقاً في أي وقت دون فقدان البيانات.
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
                <span>{initialData ? "جاري الحفظ..." : "جاري الإنشاء..."}</span>
              </>
            ) : (
              <span>{initialData ? "حفظ التغييرات" : "إنشاء القسم"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
