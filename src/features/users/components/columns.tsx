import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Calendar, Phone } from "lucide-react";
import type { BackendUser } from "@/types";
import { Actions } from "./Actions";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].charAt(0);
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
}

export const columns: ColumnDef<BackendUser>[] = [
  {
    accessorKey: "name",
    header: "المستخدم",
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.is_active;
      const phoneDisplay = user.phone || user.user_name;
      const formattedDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString("ar-YE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—";

      return (
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div
            className={cn(
              "w-[72px] h-[68px] sm:w-[82px] sm:h-[76px] rounded-2xl flex items-center justify-center shrink-0 transition-colors",
              isActive
                ? "bg-[#f2f3f8] dark:bg-muted/50"
                : "bg-[#e5e2d8] dark:bg-muted/70"
            )}
          >
            <div
              className={cn(
                "size-11 rounded-full bg-white dark:bg-card flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] font-extrabold text-sm",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {getInitials(user.name)}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5 text-right">
            <div className="flex items-center flex-wrap gap-2.5">
              <h3
                className={cn(
                  "text-base sm:text-[17px] font-extrabold tracking-tight truncate",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {user.name}
              </h3>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                  isActive
                    ? "bg-[#e8f5ee] dark:bg-emerald-950/40 text-[#1b7a4b] dark:text-emerald-400"
                    : "bg-[#fcebea] dark:bg-red-950/40 text-[#c23b2b] dark:text-red-400"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full shrink-0",
                    isActive
                      ? "bg-[#1b7a4b] dark:bg-emerald-400"
                      : "bg-[#c23b2b] dark:bg-red-400"
                  )}
                />
                {isActive ? "نشط" : "موقوف"}
              </span>

              {user.must_change_password && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fbf1e6] dark:bg-amber-950/40 text-[#8a4a12] dark:text-amber-300">
                  بانتظار تغيير كلمة المرور
                </span>
              )}
            </div>

            <p
              className={cn(
                "text-xs sm:text-[13px] line-clamp-1",
                isActive ? "text-muted-foreground" : "text-muted-foreground/80"
              )}
            >
              {user.email ? user.email : `اسم المستخدم: ${user.user_name}`}
            </p>

            <div className="flex items-center flex-wrap gap-2 pt-0.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                  isActive
                    ? "bg-[#f8f7f3] dark:bg-muted/30 text-foreground/80"
                    : "bg-transparent text-muted-foreground px-1.5"
                )}
              >
                <Building2
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive ? "text-[#cd9933]" : "text-muted-foreground/70"
                  )}
                />
                <span>{user.department?.name || "بدون قسم"}</span>
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                  isActive
                    ? "bg-[#f8f7f3] dark:bg-muted/30 text-foreground/80"
                    : "bg-transparent text-muted-foreground px-1.5"
                )}
              >
                <Phone
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive ? "text-[#cd9933]" : "text-muted-foreground/70"
                  )}
                />
                <span className="font-mono" dir="ltr">
                  {phoneDisplay}
                </span>
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                  isActive
                    ? "bg-[#f8f7f3] dark:bg-muted/30 text-foreground/80"
                    : "bg-transparent text-muted-foreground px-1.5"
                )}
              >
                <Calendar
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive ? "text-[#cd9933]" : "text-muted-foreground/70"
                  )}
                />
                <span>{formattedDate}</span>
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "الحالة",
    filterFn: (row, _columnId, filterValue) => {
      if (filterValue === "active") return row.original.is_active === true;
      if (filterValue === "inactive") return row.original.is_active === false;
      return true;
    },
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => <Actions user={row.original} />,
  },
];
