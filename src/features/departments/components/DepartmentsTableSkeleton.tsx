import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentsTableSkeletonProps {
  rowCount?: number;
}

export function DepartmentsTableSkeleton({ rowCount = 5 }: DepartmentsTableSkeletonProps) {
  return (
    <div className="px-4 sm:px-6 pb-5 pt-1 space-y-3" dir="rtl">
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          key={index}
          className="rounded-[20px] border border-border bg-card px-4 py-4 sm:px-5 sm:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          {/* Right Section: Icon Tile + Info Stack */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Skeleton className="w-[72px] h-[68px] sm:w-[82px] sm:h-[76px] rounded-2xl shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-60 max-w-full rounded-md" />
              <div className="flex items-center gap-2 pt-0.5">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* Left Section: Actions */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <Skeleton className="h-11 w-[108px] rounded-xl" />
            <Skeleton className="h-11 w-[108px] rounded-xl" />
            <Skeleton className="size-11 rounded-xl" />
            <Skeleton className="size-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
