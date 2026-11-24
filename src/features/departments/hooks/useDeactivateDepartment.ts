import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import type { ApiResponse, Department, DepartmentStats, PaginatedResponse } from "@/types";

export interface DeactivateDepartmentVariables {
  id: number | string;
  confirm?: boolean;
}

export const useDeactivateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, confirm = false }: DeactivateDepartmentVariables) =>
      departmentApi.deactivateDepartment(id, confirm),
    onMutate: async ({ id }: DeactivateDepartmentVariables) => {
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
                ? { ...dept, is_active: false }
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
            active_departments_count: Math.max(
              0,
              previousStats.data.active_departments_count - 1
            ),
            inactive_departments_count: previousStats.data.inactive_departments_count + 1,
          },
        });
      }

      return { previousQueries, previousStats };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousStats) {
        queryClient.setQueryData(["departments", "stats"], context.previousStats);
      }
    },
    onSuccess: (_response, { id, confirm }) => {
      queryClient.setQueriesData<PaginatedResponse<Department>>(
        { queryKey: ["departments"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((dept) =>
              dept.id === Number(id) || dept.id === String(id)
                ? { ...dept, is_active: false }
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

      if (confirm) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
      }
    },
  });
};
