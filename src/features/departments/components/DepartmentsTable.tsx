import { useState } from "react";
import { Building2, Calendar, CheckCircle2, FolderSearch, Hash, PauseCircle } from "lucide-react";
import type { Department, DepartmentStats } from "@/types";
import { DepartmentActions } from "./DepartmentActions";
import { cn } from "@/lib/utils";

type StatusTab = "all" | "active" | "inactive";

interface DepartmentsTableProps {
  departments: Department[];
  stats?: DepartmentStats;
}

export const DepartmentsTable = ({ departments, stats }: DepartmentsTableProps) => {
  const [status, setStatus] = useState<StatusTab>("all");

  const filtered = departments.filter((dept) => {
    if (status === "active") return dept.is_active;
    if (status === "inactive") return !dept.is_active;
    return true;
  });

  const totalCount = stats?.departments_count ?? departments.length;
  const activeCount = stats?.active_departments_count ?? departments.filter((d) => d.is_active).length;
  const inactiveCount =
    stats?.inactive_departments_count ?? departments.filter((d) => !d.is_active).length;

  return (
    <div
      className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs"
      dir="rtl"
    >
      {/* Status Tabs Toolbar */}
      <div className="p-4 sm:px-6 pt-5 pb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 p-1 bg-[#f3f3f6] dark:bg-muted/50 rounded-xl">
          <button
            type="button"
            onClick={() => setStatus("all")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              status === "all"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            الكل ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatus("active")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              status === "active"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            نشطة ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatus("inactive")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer",
              status === "inactive"
                ? "bg-card text-primary font-extrabold shadow-xs"
                : "text-muted-foreground hover:text-foreground font-semibold"
            )}
          >
            موقوفة ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Figma Card Rows List */}
      <div className="px-4 sm:px-6 pb-5 pt-1 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-14 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground">
              <FolderSearch className="size-7 stroke-[1.5]" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">
              لا توجد أقسام مضافة حالياً
            </p>
          </div>
        ) : (
          filtered.map((dept) => {
            const isActive = dept.is_active;
            const formattedDate = dept.created_at
              ? new Date(dept.created_at).toLocaleDateString("ar-YE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—";

            return (
              <div
                key={dept.id}
                className={cn(
                  "rounded-[20px] border px-4 py-4 sm:px-5 sm:py-4 transition-all duration-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
                  isActive
                    ? "bg-card border-border hover:border-[#c8c5ba] dark:hover:border-border hover:shadow-xs"
                    : "bg-[#f4f5f8] dark:bg-muted/25 border-border/80"
                )}
              >
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
                    <div className="flex items-center flex-wrap gap-2.5">
                      <h3
                        className={cn(
                          "text-base sm:text-[17px] font-extrabold tracking-tight truncate",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {dept.name}
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

                    <p
                      className={cn(
                        "text-xs sm:text-[13px] line-clamp-1",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/80"
                      )}
                    >
                      {dept.description || "لا يوجد وصف مسجل لهذا القسم"}
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
                        <Hash
                          className={cn(
                            "size-3.5 shrink-0",
                            isActive ? "text-[#cd9933]" : "text-muted-foreground/70"
                          )}
                        />
                        <span>قسم #{dept.id}</span>
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

                <DepartmentActions department={dept} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
