import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Camera,
  ExternalLink,
  FilePlus2,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserAttachments } from "@/features/users/hooks/attachment/useAttachments";
import { useCreateAttachment } from "@/features/users/hooks/attachment/useCreateAttachment";
import { useUpdateAttachment } from "@/features/users/hooks/attachment/useUpdateAttachment";
import { useDeleteAttachment } from "@/features/users/hooks/attachment/useDeleteAttachment";
import type { UserAttachment } from "@/types";

interface ProfileDocumentsCardProps {
  userId: number | string;
  hasEmail: boolean;
}

const REQUIRED_DOCS = [
  {
    key: "الصورة الشخصية",
    subtitle: "صورة واضحة للوجه · JPG أو PNG حتى 5 MB",
  },
  {
    key: "الهوية الشخصية",
    subtitle: "نسخة واضحة من البطاقة الشخصية أو الجواز · PDF أو صورة",
  },
  {
    key: "السيرة الذاتية",
    subtitle: "ملف السيرة الذاتية أو آخر مؤهل علمي · PDF أو DOCX",
  },
] as const;

export const ProfileDocumentsCard = ({
  userId,
  hasEmail,
}: ProfileDocumentsCardProps) => {
  const { data: attachmentsData, isPending } = useUserAttachments(userId);
  const { mutate: createAttachment, isPending: isCreating } = useCreateAttachment();
  const { mutate: updateAttachment, isPending: isUpdating } = useUpdateAttachment();
  const { mutate: deleteAttachment, isPending: isDeleting } = useDeleteAttachment();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingAttachment, setReplacingAttachment] =
    useState<UserAttachment | null>(null);
  const [deletingAttachment, setDeletingAttachment] =
    useState<UserAttachment | null>(null);

  const attachments = attachmentsData?.data ?? [];

  // Calculate profile completion (3 core info items + 3 required documents = 6)
  const missingRequiredDocs = REQUIRED_DOCS.filter(
    (req) => !attachments.some((att) => att.name.includes(req.key))
  );
  const baseCompleted = 2 + (hasEmail ? 1 : 0);
  const docsCompleted = REQUIRED_DOCS.length - missingRequiredDocs.length;
  const completedCount = Math.min(6, baseCompleted + docsCompleted);
  const completionPercent = Math.round((completedCount / 6) * 100);

  const openUploadDialog = (presetTitle = "") => {
    setDocTitle(presetTitle);
    setDocFile(null);
    setIsAddOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docTitle.trim().length < 2) {
      toast.error("اسم المستند يجب أن لا يقل عن حرفين");
      return;
    }
    if (!docFile) {
      toast.error("يرجى اختيار الملف المرفق");
      return;
    }
    if (docFile.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const formData = new FormData();
    formData.append("name", docTitle.trim());
    formData.append("file", docFile);

    createAttachment(
      { userId, data: formData },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم إرفاق المستند بنجاح");
          setIsAddOpen(false);
          setDocTitle("");
          setDocFile(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر إرفاق المستند");
        },
      }
    );
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !replacingAttachment) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يجب ألا يتجاوز 5 ميجابايت");
      setReplacingAttachment(null);
      return;
    }

    const formData = new FormData();
    formData.append("name", replacingAttachment.name);
    formData.append("file", file);

    updateAttachment(
      {
        userId,
        attachmentId: replacingAttachment.id,
        data: formData,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم استبدال المستند بنجاح");
          setReplacingAttachment(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر استبدال المستند");
          setReplacingAttachment(null);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingAttachment) return;

    deleteAttachment(
      {
        userId,
        attachmentId: deletingAttachment.id,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "تم حذف المستند بنجاح");
          setDeletingAttachment(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "تعذر حذف المستند");
        },
      }
    );
  };

  return (
    <>
      {/* Figma Requirements Alert Banner */}
      {missingRequiredDocs.length > 0 && (
        <div
          className="bg-[var(--brand-secondary-subtle)] border-[1.5px] border-[#cd9933] rounded-3xl px-5 py-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          dir="rtl"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-[#cd9933] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-0.5 text-right">
              <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                لديك {missingRequiredDocs.length} متطلبات يُنصح باستكمالها
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ارفع صورتك الشخصية وصورة الهوية والسيرة الذاتية لإكمال ملفك الشخصي في الأرشيف.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
            <div className="w-full sm:w-[220px] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">
                  اكتمال الملف الشخصي · {completionPercent}%
                </span>
                <span className="text-muted-foreground">{completedCount} من 6</span>
              </div>
              <div className="h-2 w-full rounded-full bg-card overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#cd9933] transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={() => openUploadDialog(missingRequiredDocs[0]?.key || "")}
              className="h-11 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs gap-2 cursor-pointer shrink-0"
            >
              <span>استكمال الآن</span>
              <ArrowLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Figma Documents Card */}
      <div
        className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-xs space-y-4"
        dir="rtl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 text-right">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground">
              المستندات والملفات الشخصية
            </h2>
            <p className="text-xs font-bold text-muted-foreground">
              ترتبط بحسابك وتُحفظ مشفّرة في الأرشيف
            </p>
          </div>

          <Button
            type="button"
            onClick={() => openUploadDialog("")}
            className="h-10 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs gap-2 self-start sm:self-auto cursor-pointer"
          >
            <FilePlus2 className="size-4" />
            <span>إرفاق مستند آخر</span>
          </Button>
        </div>

        {/* Hidden input for replacing an existing attachment */}
        <input
          ref={replaceInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleReplaceFile}
        />

        {isPending ? (
          <div className="py-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span>جاري جلب مستنداتك الشخصية...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Missing required documents (Dashed rows matching Figma) */}
            {missingRequiredDocs.map((req) => (
              <div
                key={req.key}
                className="rounded-2xl border border-dashed border-[var(--feedback-error-fg)]/60 bg-background/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-11 rounded-xl bg-[var(--feedback-error-bg)] text-[var(--feedback-error-fg)] flex items-center justify-center shrink-0">
                    <Camera className="size-5" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-sm font-bold text-foreground truncate">
                      {req.key}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground truncate">
                      {req.subtitle}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openUploadDialog(req.key)}
                  className="h-10 px-5 rounded-xl bg-card border-border text-xs font-bold gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <span>رفع ملف</span>
                  <Upload className="size-3.5" />
                </Button>
              </div>
            ))}

            {/* Uploaded attachments (Solid rows matching Figma + Delete button) */}
            {attachments.map((att) => (
              <div
                key={att.id}
                className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#c8c5ba] dark:hover:border-border transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                    <Award className="size-5" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-sm font-bold text-foreground truncate">
                      {att.name}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground truncate">
                      {att.created_at
                        ? `تاريخ الرفع: ${new Date(att.created_at).toLocaleDateString(
                            "ar-YE",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}`
                        : "مرفق محفوظ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto shrink-0">
                  {att.file_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 px-4 rounded-xl border-border text-xs font-bold gap-1.5"
                    >
                      <a href={att.file_url} target="_blank" rel="noreferrer">
                        <span>عرض</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdating && replacingAttachment?.id === att.id}
                    onClick={() => {
                      setReplacingAttachment(att);
                      replaceInputRef.current?.click();
                    }}
                    className="h-10 px-4 rounded-xl border-border text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    {isUpdating && replacingAttachment?.id === att.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>استبدال</span>
                        <RefreshCw className="size-3.5" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeletingAttachment(att)}
                    title="حذف المستند"
                    className="h-10 px-3.5 rounded-xl border-rose-200 dark:border-rose-900/40 text-destructive hover:bg-destructive/10 text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    <span>حذف</span>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(next) => !isCreating && setIsAddOpen(next)}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-lg font-extrabold text-foreground">
              إرفاق مستند شخصي
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              سيتم ربط المستند بحسابك الشخصي مباشرة
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-foreground block">
                عنوان المستند <span className="text-destructive">*</span>
              </label>
              <Input
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                disabled={isCreating}
                placeholder="مثال: الصورة الشخصية أو شهادة البكالوريوس"
                className="h-11 rounded-xl bg-card border-border text-sm"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-foreground block">
                الملف المرفق <span className="text-destructive">*</span>
              </label>
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 text-center bg-surface-alt/50 cursor-pointer">
                <Upload className="size-5 text-primary" />
                <span className="text-xs font-bold text-foreground truncate max-w-[280px]">
                  {docFile ? docFile.name : "انقر لاختيار ملف (حتى 5 ميجابايت)"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  JPG, PNG, WEBP, PDF, DOC, DOCX
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                  disabled={isCreating}
                  onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isCreating}
                className="h-10 px-4 rounded-xl text-xs font-bold cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="h-10 px-5 rounded-xl text-xs font-bold gap-2 cursor-pointer"
              >
                {isCreating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span>رفع المستند</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingAttachment)}
        onOpenChange={(next) => {
          if (!next && !isDeleting) {
            setDeletingAttachment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl p-6" dir="rtl">
          <DialogHeader className="text-right">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <DialogTitle className="text-lg font-extrabold text-foreground">
                حذف المستند الشخصي
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
              هل أنت متأكد من حذف المستند{" "}
              <span className="font-extrabold text-foreground">
                {deletingAttachment?.name}
              </span>
              ؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingAttachment(null)}
              disabled={isDeleting}
              className="rounded-xl h-10 px-4 text-xs font-bold cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl h-10 px-5 text-xs font-bold gap-2 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span>تأكيد الحذف</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
