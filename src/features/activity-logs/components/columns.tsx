import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Actions } from "./Actions";
import type { ActivityLog } from "@/types";

const MODULE_LABELS: Record<string, string> = {
  departments: "الأقسام",
  users: "المستخدمون",
  auth: "بوابة النظام",
  files: "الأرشيف",
};

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "نظ";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2);
  }
  return parts
    .slice(0, 3)
    .map((p) => p.charAt(0))
    .join("");
}

function getEventPillClasses(event?: string | null): string {
  if (!event) {
    return "bg-surface-alt text-muted-foreground";
  }

  if (
    event.includes("إنشاء") ||
    event.includes("رفع") ||
    event.includes("تفعيل") ||
    event.includes("استعادة")
  ) {
    return "bg-[var(--feedback-success-bg)] text-[var(--feedback-success-fg)]";
  }

  if (
    event.includes("حذف") ||
    event.includes("إيقاف") ||
    event.includes("إقفال")
  ) {
    return "bg-[var(--feedback-error-bg)] text-[var(--feedback-error-fg)]";
  }

  if (event.includes("أرشفة") || event.includes("نقل")) {
    return "bg-[var(--brand-secondary-subtle)] text-[var(--text-accent)]";
  }

  if (
    event.includes("تحديث") ||
    event.includes("تعديل") ||
    event.includes("دخول") ||
    event.includes("كلمة المرور")
  ) {
    return "bg-secondary text-primary";
  }

  return "bg-surface-alt text-muted-foreground";
}

function formatArabicDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTimeFallback(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const columns: ColumnDef<ActivityLog>[] = [
  {
    id: "causer",
    header: "المستخدم",
    cell: ({ row }) => {
      const causer = row.original.causer;
      const userName = causer?.name || "النظام";
      const subtitle = causer ? "مستخدم النظام" : "عملية تلقائية";
      const useGoldAvatar = row.original.id % 2 === 0;

      return (
        <div className="flex items-center gap-2.5 min-w-[165px]">
          <div
            className={cn(
              "size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 select-none",
              useGoldAvatar
                ? "bg-[var(--brand-secondary-subtle)] text-[var(--text-accent)]"
                : "bg-secondary text-primary"
            )}
          >
            {getInitials(userName)}
          </div>
          <div className="flex flex-col text-right min-w-0">
            <span className="text-sm font-bold text-foreground truncate">
              {userName}
            </span>
            <span className="text-xs font-bold text-muted-foreground truncate">
              {subtitle}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "event",
    header: "العملية",
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      return row.original.event === filterValue;
    },
    cell: ({ row }) => {
      const eventLabel = row.original.event || "عملية";
      return (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-bold whitespace-nowrap",
            getEventPillClasses(eventLabel)
          )}
        >
          {eventLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "العنصر",
    cell: ({ row }) => {
      const { description, module } = row.original;
      const moduleLabel = (module && MODULE_LABELS[module]) || module;

      return (
        <div className="flex flex-col gap-0.5 text-right min-w-[220px]">
          <span className="text-sm font-medium text-foreground leading-relaxed">
            {description}
          </span>
          {moduleLabel && (
            <span className="text-[11px] font-bold text-muted-foreground">
              {moduleLabel}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "التاريخ",
    cell: ({ row }) => (
      <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
        {formatArabicDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "time_ago",
    header: "الوقت",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
        {row.original.time_ago || formatTimeFallback(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <Actions log={row.original} />,
  },
];
