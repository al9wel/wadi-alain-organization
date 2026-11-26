import { useState } from "react";
import { Eye, History, FileDiff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useActivityLogDetails, useSubjectActivityLogs } from "../hooks/useActivityLogs";
import type { ActivityLog } from "@/types";

interface ActionsProps {
  log: ActivityLog;
}

const FIELD_LABELS: Record<string, string> = {
  name: "الاسم",
  user_name: "اسم المستخدم",
  email: "البريد الإلكتروني",
  phone: "رقم الهاتف",
  is_active: "الحالة",
  description: "الوصف",
  manager_id: "معرف المدير",
  department_id: "معرف القسم",
  role: "الدور",
};

const MODULE_LABELS: Record<string, string> = {
  departments: "الأقسام",
  users: "المستخدمون",
  auth: "المصادقة",
  files: "الأرشيف",
};

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "نشط / نعم" : "موقوف / لا";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatFullDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function Actions({ log }: ActionsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  const hasSubjectHistory = Boolean(log.module && log.subject?.id);

  const { data: detailResponse, isPending: isDetailPending } = useActivityLogDetails(
    log.id,
    open
  );
  const { data: historyResponse, isPending: isHistoryPending } = useSubjectActivityLogs(
    log.module,
    log.subject?.id ?? null,
    open && activeTab === "history" && hasSubjectHistory
  );

  const record = detailResponse?.data ?? log;
  const oldValues = record.changes?.old ?? {};
  const newValues = record.changes?.attributes ?? {};
  const changedKeys = Array.from(
    new Set([...Object.keys(oldValues), ...Object.keys(newValues)])
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setActiveTab("details");
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary cursor-pointer"
          title="عرض تفاصيل السجل"
        >
          <Eye className="size-4" />
          <span className="sr-only">عرض تفاصيل السجل</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>تفاصيل سجل النشاط #{record.id}</span>
          </DialogTitle>
          <DialogDescription>
            {record.description}
          </DialogDescription>
        </DialogHeader>

        {hasSubjectHistory && (
          <div className="inline-flex items-center gap-1 p-1 bg-surface-alt rounded-xl border border-border self-start">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                activeTab === "details"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileDiff className="size-3.5" />
              <span>تفاصيل العملية</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                activeTab === "history"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="size-3.5" />
              <span>سجل عمليات العنصر</span>
            </button>
          </div>
        )}

        {activeTab === "details" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface-alt/70 border border-border rounded-2xl p-4">
              <div className="space-y-1">
                <span className="text-muted-foreground font-bold">المنفذ:</span>
                <p className="font-extrabold text-foreground">
                  {record.causer?.name || "النظام"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-bold">نوع العملية:</span>
                <p className="font-extrabold text-primary">
                  {record.event || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-bold">القسم / الوحدة:</span>
                <p className="font-bold text-foreground">
                  {(record.module && MODULE_LABELS[record.module]) || record.module || "عام"}
                  {record.subject?.id ? ` (#${record.subject.id})` : ""}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-bold">التاريخ والوقت:</span>
                <p className="font-bold text-foreground">
                  {formatFullDateTime(record.created_at)}
                </p>
              </div>
            </div>

            {isDetailPending && !detailResponse ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>جاري تحميل التفاصيل...</span>
              </div>
            ) : changedKeys.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-foreground">
                  التغييرات المسجلة
                </h4>
                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-surface-alt text-muted-foreground font-bold">
                      <tr>
                        <th className="py-2.5 px-3">الحقل</th>
                        {Object.keys(oldValues).length > 0 && (
                          <th className="py-2.5 px-3">القيمة السابقة</th>
                        )}
                        <th className="py-2.5 px-3">القيمة الجديدة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {changedKeys.map((key) => (
                        <tr key={key} className="bg-card">
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            {FIELD_LABELS[key] || key}
                          </td>
                          {Object.keys(oldValues).length > 0 && (
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {formatFieldValue(oldValues[key])}
                            </td>
                          )}
                          <td className="py-2.5 px-3 font-bold text-primary">
                            {formatFieldValue(newValues[key])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground bg-surface-alt/50 border border-border rounded-xl p-3 text-center">
                لا توجد تغييرات حقول إضافية مسجلة لهذه العملية.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {isHistoryPending ? (
              <div className="py-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>جاري جلب تاريخ العنصر...</span>
              </div>
            ) : historyResponse?.data?.length ? (
              historyResponse.data.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-xl border p-3 text-xs flex items-center justify-between gap-3",
                    item.id === record.id
                      ? "border-primary/40 bg-secondary/50"
                      : "border-border bg-card"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-primary">{item.event}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-bold text-foreground">
                        {item.causer?.name || "النظام"}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap shrink-0">
                    {item.time_ago || formatFullDateTime(item.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">
                لا يوجد سجل عمليات سابق لهذا العنصر.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
