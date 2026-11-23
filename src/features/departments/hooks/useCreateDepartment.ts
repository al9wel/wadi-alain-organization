import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import type { CreateDepartmentRequest } from "@/types";

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", "stats"] });
    },
  });
};
