import type { PaginationMeta } from "./api.types";

export interface ActivityLogEventOption {
  value: string;
  label: string;
}

export interface ActivityLogSubject {
  type: string;
  id: number;
}

export interface ActivityLogCauser {
  type: string;
  id: number;
  name?: string | null;
}

export interface ActivityLogChanges {
  old?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export interface ActivityLog {
  id: number;
  module: string | null;
  event: string | null;
  description: string;
  subject: ActivityLogSubject | null;
  causer: ActivityLogCauser | null;
  changes: ActivityLogChanges | null;
  properties: Record<string, unknown> | null;
  created_at: string | null;
  time_ago?: string | null;
}

export interface ActivityLogPaginationMeta extends PaginationMeta {
  events?: ActivityLogEventOption[];
  week_start?: string;
  week_end?: string;
}

export interface ActivityLogPaginatedResponse {
  success: boolean;
  message: string;
  data: ActivityLog[];
  meta: ActivityLogPaginationMeta;
}

export type ActivityLogUiPeriod = "all" | "today" | "week" | "month";

export interface ActivityLogFilterParams {
  period?: "all" | "week" | "month";
  module?: string;
  event?: string;
  subject_id?: number;
  causer_id?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ActivityLogStats {
  total_logs: number;
  today_logs: number;
  by_module: Record<string, number>;
  by_event: Record<string, number>;
}

export interface DailyActivityStat {
  day: string;
  date: string;
  created: number;
  updated: number;
  deleted: number;
  activated: number;
  deactivated: number;
  total: number;
}

export interface WeeklyActivityStatistics {
  week_start: string;
  week_end: string;
  days: DailyActivityStat[];
  week_total: number;
}

export interface WeeklyActivityStatsResponseData {
  weekly_activity_statistics: WeeklyActivityStatistics;
}
