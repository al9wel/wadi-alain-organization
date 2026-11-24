import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { ApiResponse, BackendUser, PaginatedResponse, UserStats } from "@/types";

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => userApi.activateUser(id),
    onMutate: async (id: number | string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousQueries = queryClient.getQueriesData<PaginatedResponse<BackendUser>>({
        queryKey: ["users"],
      });
      const previousStats = queryClient.getQueryData<ApiResponse<UserStats>>(["users", "stats"]);

      queryClient.setQueriesData<PaginatedResponse<BackendUser>>(
        { queryKey: ["users"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) =>
              u.id === Number(id) || u.id === String(id) ? { ...u, is_active: true } : u
            ),
          };
        }
      );

      if (previousStats?.data) {
        queryClient.setQueryData<ApiResponse<UserStats>>(["users", "stats"], {
          ...previousStats,
          data: {
            ...previousStats.data,
            active_users_count: previousStats.data.active_users_count + 1,
            inactive_users_count: Math.max(0, previousStats.data.inactive_users_count - 1),
          },
        });
      }

      return { previousQueries, previousStats };
    },
    onError: (_error, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousStats) {
        queryClient.setQueryData(["users", "stats"], context.previousStats);
      }
    },
    onSuccess: (_response, id) => {
      queryClient.setQueriesData<PaginatedResponse<BackendUser>>(
        { queryKey: ["users"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((u) =>
              u.id === Number(id) || u.id === String(id) ? { ...u, is_active: true } : u
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["users"], refetchType: "inactive" });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
