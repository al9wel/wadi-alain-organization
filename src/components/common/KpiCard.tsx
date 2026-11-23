import type { ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ComponentType<{ className?: string }>;
  variant?: "navy" | "gold" | "success" | "warning" | "default";
  isLoading?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  isLoading = false,
  className,
}: KpiCardProps) {
  const iconVariants = {
    navy: "bg-[#020066]/10 text-[#020066] dark:bg-[#020066]/30 dark:text-blue-300",
    gold: "bg-[#cd9933]/15 text-[#b07d1c] dark:bg-[#cd9933]/25 dark:text-amber-300",
    success: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    default: "bg-muted text-foreground",
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm min-h-[140px]",
        className
      )}
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs sm:text-sm font-bold text-muted-foreground leading-snug">
          {title}
        </p>
        <div
          className={cn(
            "size-11 sm:size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs",
            iconVariants[variant]
          )}
        >
          <Icon className="size-5 sm:size-6" />
        </div>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <Skeleton className="h-8 w-16 rounded-lg my-1" />
        ) : (
          <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {value}
          </p>
        )}
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
