import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "../api/activityLogApi";
import type { ActivityLogFilterParams, ActivityLogUiPeriod } from "@/types";

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const useActivityLogs = (period: ActivityLogUiPeriod = "all") => {
  return useQuery({
    queryKey: ["activity-logs", period],
    queryFn: () => {
      const params: ActivityLogFilterParams = { per_page: 100 };

      if (period === "today") {
        const today = getTodayDateString();
        params.period = "all";
        params.from_date = today;
        params.to_date = today;
      } else {
        params.period = period;
      }

      return activityLogApi.getActivityLogs(params);
    },
  });
};

export const useActivityLogDetails = (id: number | null, enabled = false) => {
  return useQuery({
    queryKey: ["activity-logs", "detail", id],
    queryFn: () => activityLogApi.getActivityLogById(id as number),
    enabled: enabled && id !== null,
  });
};

export const useSubjectActivityLogs = (
  module: string | null,
  subjectId: number | null,
  enabled = false
) => {
  return useQuery({
    queryKey: ["activity-logs", "subject", module, subjectId],
    queryFn: () =>
      activityLogApi.getSubjectActivityLogs(module as string, subjectId as number),
    enabled: enabled && Boolean(module) && subjectId !== null,
  });
};
