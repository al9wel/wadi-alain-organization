import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  ActivityLog,
  ActivityLogFilterParams,
  ActivityLogPaginatedResponse,
  ActivityLogStats,
  WeeklyActivityStatsResponseData,
} from "@/types";

export const activityLogApi = {
  getActivityLogs: async (
    params?: ActivityLogFilterParams
  ): Promise<ActivityLogPaginatedResponse> => {
    const response = await apiClient.get<ActivityLogPaginatedResponse>("/activity-logs", {
      params,
    });
    return response.data;
  },

  getActivityLogById: async (id: number | string): Promise<ApiResponse<ActivityLog>> => {
    const response = await apiClient.get<ApiResponse<ActivityLog>>(`/activity-logs/${id}`);
    return response.data;
  },

  getSubjectActivityLogs: async (
    module: string,
    subjectId: number | string,
    perPage = 15
  ): Promise<ActivityLogPaginatedResponse> => {
    const response = await apiClient.get<ActivityLogPaginatedResponse>(
      `/activity-logs/subject/${encodeURIComponent(module)}/${subjectId}`,
      {
        params: { per_page: perPage },
      }
    );
    return response.data;
  },

  getActivityLogsByWeek: async (
    week: string,
    params?: ActivityLogFilterParams
  ): Promise<ActivityLogPaginatedResponse> => {
    const response = await apiClient.get<ActivityLogPaginatedResponse>(
      `/activity-logs/weeks/${encodeURIComponent(week)}`,
      {
        params,
      }
    );
    return response.data;
  },

  getActivityLogStats: async (module?: string): Promise<ApiResponse<ActivityLogStats>> => {
    const response = await apiClient.get<ApiResponse<ActivityLogStats>>(
      "/activity-logs/stats",
      {
        params: module ? { module } : undefined,
      }
    );
    return response.data;
  },

  getWeeklyActivityLogStats: async (params?: {
    module?: string;
    date?: string;
    week_offset?: number;
  }): Promise<ApiResponse<WeeklyActivityStatsResponseData>> => {
    const response = await apiClient.get<ApiResponse<WeeklyActivityStatsResponseData>>(
      "/activity-logs/stats/weekly",
      {
        params,
      }
    );
    return response.data;
  },
};
