import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import type { UpdateDepartmentRequest } from "@/types";

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateDepartmentRequest }) =>
      departmentApi.updateDepartment(id, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["departments", "stats"] });
    },
  });
};
