import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, FileText, Loader2, Upload, User as UserIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "../../hooks/users/useUsers";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const attachmentSchema = z.object({
  name: z
    .string()
    .min(2, "اسم المرفق يجب أن لا يقل عن حرفين")
    .max(150, "اسم المرفق يجب ألا يتجاوز 150 حرفاً"),
  userId: z.string().min(1, "يرجى اختيار المستخدم"),
});

type AttachmentFormValues = z.infer<typeof attachmentSchema>;

interface AttachmentFormProps {
  initialData?: {
    name: string;
    userId: number | string;
    fileUrl?: string;
  } | null;
  onSubmit: (payload: { userId: number; formData: FormData }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AttachmentForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: AttachmentFormProps) => {
  const { data: usersData, isPending: isLoadingUsers } = useUsers();
  const users = usersData?.data ?? [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      userId: initialData?.userId ? String(initialData.userId) : "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setFileError("حجم الملف يجب ألا يتجاوز 5 ميجابايت.");
      setSelectedFile(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
  };

  const handleFormSubmit = (values: AttachmentFormValues) => {
    if (!initialData && !selectedFile) {
      setFileError("ملف المرفق مطلوب.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name.trim());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    onSubmit({
      userId: Number(values.userId),
      formData,
    });
  };

  const displayFileName =
    selectedFile?.name || (initialData ? `${initialData.name} (الملف الحالي)` : null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 pt-2"
        dir="rtl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  اسم الملحق <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="مثال: الهوية الشخصية أو عقد العمل"
                    className="h-11 rounded-xl bg-card border-border text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="space-y-1.5 text-right">
                <FormLabel className="text-xs font-bold text-foreground">
                  المستخدم <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    dir="rtl"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || isLoadingUsers || Boolean(initialData)}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-card border-border text-sm">
                      <div className="flex items-center gap-2 truncate">
                        <UserIcon className="size-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="اختر المستخدم..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name}
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

        <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-foreground block">
            الملف المرفق {!initialData && <span className="text-destructive">*</span>}
          </label>
          <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer text-center bg-surface-alt/50">
            <div className="size-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
              {selectedFile ? <Check className="size-5" /> : <Upload className="size-5" />}
            </div>
            <div className="flex items-center gap-1.5 max-w-full px-3">
              {displayFileName && (
                <FileText className="size-4 shrink-0 text-primary" />
              )}
              <span className="text-xs font-bold text-foreground truncate max-w-[320px]">
                {displayFileName || "انقر لاختيار ملف أو اسحبه هنا"}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              الصيغ المدعومة: JPG, PNG, WEBP, PDF, DOC, DOCX (بحد أقصى 5 ميجابايت)
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isLoading}
              onChange={handleFileChange}
            />
          </div>
          {fileError && <p className="text-xs text-destructive font-bold">{fileError}</p>}
        </div>

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
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm shadow-xs cursor-pointer gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{initialData ? "جاري التحديث..." : "جاري الرفع..."}</span>
              </>
            ) : (
              <span>{initialData ? "حفظ التعديلات" : "إضافة الملحق"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
