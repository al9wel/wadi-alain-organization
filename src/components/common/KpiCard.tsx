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
        "bg-card border border-border rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 shadow-xs flex items-center justify-between gap-3 transition-all hover:shadow-sm",
        className
      )}
      dir="rtl"
    >
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-bold text-muted-foreground leading-snug">
          {title}
        </p>

        {isLoading ? (
          <Skeleton className="h-7 w-14 rounded-lg my-0.5" />
        ) : (
          <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-none">
            {value}
          </p>
        )}

        {subtitle && (
          <p className="text-[11px] text-muted-foreground font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={cn(
          "size-10 rounded-xl flex items-center justify-center shrink-0",
          iconVariants[variant]
        )}
      >
        <Icon className="size-5" />
      </div>
    </div>
  );
}
