import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ActivityLogStats, DailyActivityStat, WeeklyActivityStatistics } from "@/types";

interface ActivityLogStatisticsCardsProps {
  stats?: ActivityLogStats;
  weeklyStats?: WeeklyActivityStatistics;
  activeUsersCount?: number;
  fallbackTotal?: number;
  isPending?: boolean;
}

const DEFAULT_DAYS: DailyActivityStat[] = [
  { day: "الأحد", date: "1", created: 0, updated: 0, deleted: 0, activated: 0, deactivated: 0, total: 0 },
  { day: "الإثنين", date: "2", created: 0, updated: 0, deleted: 0, activated: 0, deactivated: 0, total: 0 },
  { day: "الثلاثاء", date: "3", created: 0, updated: 0, deleted: 0, activated: 0, deactivated: 0, total: 0 },
  { day: "الأربعاء", date: "4", created: 0, updated: 0, deleted: 0, activated: 0, deactivated: 0, total: 0 },
  { day: "الخميس", date: "5", created: 0, updated: 0, deleted: 0, activated: 0, deactivated: 0, total: 0 },
];

function selectDisplayDays(days?: DailyActivityStat[]): DailyActivityStat[] {
  if (!days || days.length === 0) return DEFAULT_DAYS;
  if (days.length <= 5) return days;

  // Backend week starts Saturday (0) -> Friday (6).
  // If Saturday (0) or Friday (6) has logs, take the 5 most recent/active days; otherwise Sunday..Thursday (1..5) matching Figma.
  const satHasLogs = (days[0]?.total ?? 0) > 0;
  const friHasLogs = (days[6]?.total ?? 0) > 0;

  if (!satHasLogs && !friHasLogs) {
    return days.slice(1, 6);
  }

  if (friHasLogs) {
    return days.slice(2, 7);
  }

  return days.slice(0, 5);
}

function buildAxisTicks(maxVal: number, fallbackTop: number): number[] {
  const safeMax = maxVal > 0 ? Math.ceil(maxVal / 4) * 4 : fallbackTop;
  return [
    safeMax,
    Math.round((safeMax * 3) / 4),
    Math.round((safeMax * 2) / 4),
    Math.round(safeMax / 4),
    0,
  ];
}

function buildSmoothAreaPaths(values: number[], width = 240, height = 116) {
  const max = Math.max(...values, 1);
  const topPad = 10;
  const bottomPad = 6;
  const usableHeight = height - topPad - bottomPad;

  // In RTL visual order, day[0] is on the right (x = width) and day[last] is on the left (x = 0)
  const points = values.map((v, idx) => {
    const ratioX = values.length > 1 ? 1 - idx / (values.length - 1) : 0.5;
    const x = Math.round(ratioX * width * 10) / 10;
    const y =
      Math.round((topPad + usableHeight - (v / max) * usableHeight) * 10) / 10;
    return { x, y };
  });

  // Sort left-to-right for clean SVG bezier curve generation
  const ordered = [...points].sort((a, b) => a.x - b.x);
  if (ordered.length === 0) {
    return { linePath: "", areaPath: "" };
  }

  let linePath = `M ${ordered[0].x} ${ordered[0].y}`;
  for (let i = 0; i < ordered.length - 1; i++) {
    const curr = ordered[i];
    const next = ordered[i + 1];
    const midX = Math.round(((curr.x + next.x) / 2) * 10) / 10;
    linePath += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaPath = `${linePath} L ${ordered[ordered.length - 1].x} ${height} L ${ordered[0].x} ${height} Z`;
  return { linePath, areaPath };
}

export function ActivityLogStatisticsCards({
  stats,
  weeklyStats,
  activeUsersCount = 0,
  fallbackTotal = 0,
  isPending = false,
}: ActivityLogStatisticsCardsProps) {
  const displayDays = selectDisplayDays(weeklyStats?.days);

  const totalLogs = stats?.total_logs ?? fallbackTotal;
  const todayLogs = stats?.today_logs ?? 0;

  // Daily totals for Card 1 (Bar Chart)
  const dailyTotals = displayDays.map((d) => d.total);
  const maxDailyTotal = Math.max(...dailyTotals, 0);
  const peakDayIndex =
    maxDailyTotal > 0 ? dailyTotals.findIndex((v) => v === maxDailyTotal) : 2;
  const totalTicks = buildAxisTicks(maxDailyTotal, 40);

  // Cumulative / active trend for Card 2 (Navy Area Chart)
  const mutationCounts = displayDays.map(
    (d) => d.created + d.updated + d.activated + d.deactivated
  );
  const hasMutations = mutationCounts.some((v) => v > 0);
  const card2Series = hasMutations
    ? mutationCounts
    : activeUsersCount > 0
      ? [
          Math.max(1, Math.round(activeUsersCount * 0.65)),
          Math.max(1, Math.round(activeUsersCount * 0.8)),
          Math.max(1, Math.round(activeUsersCount * 0.72)),
          Math.max(1, Math.round(activeUsersCount * 0.9)),
          activeUsersCount,
        ]
      : [0, 0, 0, 0, 0];
  const card2Max = Math.max(...card2Series, activeUsersCount, 0);
  const card2Ticks = buildAxisTicks(card2Max, 20);
  const navyPaths = buildSmoothAreaPaths(card2Series);

  // Daily events trend for Card 3 (Gold Area Chart)
  const hasDailyTotals = dailyTotals.some((v) => v > 0);
  const card3Series = hasDailyTotals
    ? dailyTotals
    : todayLogs > 0
      ? [0, 0, 0, Math.max(0, Math.floor(todayLogs / 2)), todayLogs]
      : [0, 0, 0, 0, 0];
  const card3Max = Math.max(...card3Series, todayLogs, 0);
  const card3Ticks = buildAxisTicks(card3Max, 20);
  const goldPaths = buildSmoothAreaPaths(card3Series);

  return (
    <section className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          نظرة عامة
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: إجمالي العمليات (Bar Chart) */}
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 text-right">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                إجمالي العمليات
              </p>
              {isPending ? (
                <Skeleton className="h-9 w-20 rounded-xl" />
              ) : (
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {totalLogs.toLocaleString("en-US")}
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--feedback-success-bg)] text-[var(--feedback-success-fg)] px-3 py-1 text-[11px] font-bold shrink-0">
              شهرياً
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-stretch gap-3 h-[120px]">
              {/* Y Axis on right (first child in RTL) */}
              <div className="flex flex-col justify-between text-[11px] font-bold text-muted-foreground w-7 text-center shrink-0 select-none">
                {totalTicks.map((tick, idx) => (
                  <span key={idx}>{tick}</span>
                ))}
              </div>

              {/* Plot Area */}
              <div className="relative flex-1 flex items-end justify-between px-2 pt-3">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="w-full h-px bg-border/70" />
                  ))}
                </div>

                {displayDays.map((dayItem, idx) => {
                  const topTick = totalTicks[0] || 1;
                  const heightPercent =
                    dayItem.total > 0
                      ? Math.max(14, Math.min(100, Math.round((dayItem.total / topTick) * 100)))
                      : 8;
                  const isPeak = idx === peakDayIndex && dayItem.total > 0;

                  return (
                    <div
                      key={`${dayItem.day}-${idx}`}
                      className="relative z-10 flex flex-col items-center justify-end h-full flex-1"
                      title={`${dayItem.day}: ${dayItem.total} عملية`}
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={cn(
                          "w-6 sm:w-7 rounded-t-lg transition-all duration-300",
                          isPeak
                            ? "bg-primary shadow-xs"
                            : "bg-[#e2e2ea] dark:bg-muted/80 hover:bg-primary/40"
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between pr-10 pl-2 text-[11px] font-bold text-muted-foreground">
              {displayDays.map((d, idx) => (
                <span key={`${d.day}-${idx}`} className="flex-1 text-center truncate">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: المستخدمون النشطون (Navy Area Chart) */}
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 text-right">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                المستخدمون النشطون
              </p>
              {isPending ? (
                <Skeleton className="h-9 w-14 rounded-xl" />
              ) : (
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {activeUsersCount.toLocaleString("en-US")}
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--feedback-success-bg)] text-[var(--feedback-success-fg)] px-3 py-1 text-[11px] font-bold shrink-0">
              أسبوعياً
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-stretch gap-3 h-[120px]">
              <div className="flex flex-col justify-between text-[11px] font-bold text-muted-foreground w-7 text-center shrink-0 select-none">
                {card2Ticks.map((tick, idx) => (
                  <span key={idx}>{tick}</span>
                ))}
              </div>

              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="w-full h-px bg-border/70" />
                  ))}
                </div>

                <svg
                  viewBox="0 0 240 116"
                  preserveAspectRatio="none"
                  className="relative z-10 w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="activityNavyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {navyPaths.areaPath && (
                    <path d={navyPaths.areaPath} fill="url(#activityNavyFill)" />
                  )}
                  {navyPaths.linePath && (
                    <path
                      d={navyPaths.linePath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between pr-10 pl-1 text-[11px] font-bold text-muted-foreground">
              {displayDays.map((d, idx) => (
                <span key={`${d.day}-${idx}`} className="flex-1 text-center truncate">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: العمليات اليوم (Gold Area Chart) */}
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 text-right">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                العمليات اليوم
              </p>
              {isPending ? (
                <Skeleton className="h-9 w-16 rounded-xl" />
              ) : (
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {todayLogs.toLocaleString("en-US")}
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--feedback-success-bg)] text-[var(--feedback-success-fg)] px-3 py-1 text-[11px] font-bold shrink-0">
              الأسبوع الحالي
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-stretch gap-3 h-[120px]">
              <div className="flex flex-col justify-between text-[11px] font-bold text-muted-foreground w-7 text-center shrink-0 select-none">
                {card3Ticks.map((tick, idx) => (
                  <span key={idx}>{tick}</span>
                ))}
              </div>

              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div key={line} className="w-full h-px bg-border/70" />
                  ))}
                </div>

                <svg
                  viewBox="0 0 240 116"
                  preserveAspectRatio="none"
                  className="relative z-10 w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="activityGoldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cd9933" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#cd9933" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {goldPaths.areaPath && (
                    <path d={goldPaths.areaPath} fill="url(#activityGoldFill)" />
                  )}
                  {goldPaths.linePath && (
                    <path
                      d={goldPaths.linePath}
                      fill="none"
                      stroke="#cd9933"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between pr-10 pl-1 text-[11px] font-bold text-muted-foreground">
              {displayDays.map((d, idx) => (
                <span key={`${d.day}-${idx}`} className="flex-1 text-center truncate">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
