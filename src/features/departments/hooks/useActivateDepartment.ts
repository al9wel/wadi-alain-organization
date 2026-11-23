import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import type { ApiResponse, Department, DepartmentStats, PaginatedResponse } from "@/types";

export const useActivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => departmentApi.activateDepartment(id),
    onMutate: async (id: number | string) => {
      await queryClient.cancelQueries({ queryKey: ["departments"] });

      const previousQueries = queryClient.getQueriesData<PaginatedResponse<Department>>({
        queryKey: ["departments"],
      });
      const previousStats = queryClient.getQueryData<ApiResponse<DepartmentStats>>([
        "departments",
        "stats",
      ]);

      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: ["departments"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((dept) =>
              dept.id === Number(id) || dept.id === String(id)
                ? { ...dept, is_active: true }
                : dept
            ),
          };
        }
      );

      if (previousStats?.data) {
        queryClient.setQueryData<ApiResponse<DepartmentStats>>(["departments", "stats"], {
          ...previousStats,
          data: {
            ...previousStats.data,
            active_departments_count: previousStats.data.active_departments_count + 1,
            inactive_departments_count: Math.max(
              0,
              previousStats.data.inactive_departments_count - 1
            ),
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
        queryClient.setQueryData(["departments", "stats"], context.previousStats);
      }
    },
    onSuccess: (_response, id) => {
      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: ["departments"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((dept) =>
              dept.id === Number(id) || dept.id === String(id)
                ? { ...dept, is_active: true }
                : dept
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["departments"],
        refetchType: "inactive",
      });
      queryClient.invalidateQueries({ queryKey: ["departments", "stats"] });
    },
  });
};
