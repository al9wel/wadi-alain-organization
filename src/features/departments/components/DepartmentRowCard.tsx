import { Building2, Calendar, CheckCircle2, Hash, PauseCircle } from "lucide-react";
import { DepartmentActions } from "./DepartmentActions";
import type { Department } from "@/types";
import { cn } from "@/lib/utils";

interface DepartmentRowCardProps {
  department: Department;
}

export function DepartmentRowCard({ department }: DepartmentRowCardProps) {
  const isActive = department.is_active;

  const formattedDate = department.created_at
    ? new Date(department.created_at).toLocaleDateString("ar-YE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div
      className={cn(
        "rounded-[20px] border px-4 py-4 sm:px-5 sm:py-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
        isActive
          ? "bg-card border-border hover:border-[#c8c5ba] dark:hover:border-border hover:shadow-xs"
          : "bg-[#f4f5f8] dark:bg-muted/25 border-border/80"
      )}
    >
      {/* Right Section: Icon Tile + Info Stack */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className={cn(
            "w-[72px] h-[68px] sm:w-[82px] sm:h-[76px] rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            isActive
              ? "bg-[#f2f3f8] dark:bg-muted/50"
              : "bg-[#e5e2d8] dark:bg-muted/70"
          )}
        >
          <div className="size-11 rounded-full bg-white dark:bg-card flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Building2
              className={cn(
                "size-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Line 1: Title + Status Pill */}
          <div className="flex items-center flex-wrap gap-2.5">
            <h3
              className={cn(
                "text-base sm:text-[17px] font-extrabold tracking-tight truncate",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {department.name}
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
          </div>

          {/* Line 2: Description */}
          <p
            className={cn(
              "text-xs sm:text-[13px] line-clamp-1",
              isActive ? "text-muted-foreground" : "text-muted-foreground/80"
            )}
          >
            {department.description || "لا يوجد وصف مسجل لهذا القسم"}
          </p>

          {/* Line 3: Metadata Pills */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                isActive
                  ? "bg-[#f8f7f3] dark:bg-muted/30 text-foreground/80"
                  : "bg-transparent text-muted-foreground px-1.5"
              )}
            >
              <Hash
                className={cn(
                  "size-3.5 shrink-0",
                  isActive ? "text-[#cd9933]" : "text-muted-foreground/70"
                )}
              />
              <span>قسم #{department.id}</span>
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

            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                isActive
                  ? "bg-[#f8f7f3] dark:bg-muted/30 text-foreground/80"
                  : "bg-transparent text-muted-foreground px-1.5"
              )}
            >
              {isActive ? (
                <CheckCircle2 className="size-3.5 shrink-0 text-[#cd9933]" />
              ) : (
                <PauseCircle className="size-3.5 shrink-0 text-muted-foreground/70" />
              )}
              <span>{isActive ? "العمليات مفعّلة" : "العمليات موقفة"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Left Section: Self-contained Actions */}
      <DepartmentActions department={department} />
    </div>
  );
}
