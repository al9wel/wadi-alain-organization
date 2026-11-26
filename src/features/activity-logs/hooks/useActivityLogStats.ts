import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "../api/activityLogApi";

export const useActivityLogStats = (module?: string) => {
  return useQuery({
    queryKey: ["activity-logs", "stats", module],
    queryFn: () => activityLogApi.getActivityLogStats(module),
    staleTime: 2 * 60 * 1000,
  });
};

export const useWeeklyActivityLogStats = (params?: {
  module?: string;
  date?: string;
  week_offset?: number;
}) => {
  return useQuery({
    queryKey: ["activity-logs", "weekly-stats", params],
    queryFn: () => activityLogApi.getWeeklyActivityLogStats(params),
    staleTime: 2 * 60 * 1000,
  });
};
