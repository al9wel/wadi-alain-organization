import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => departmentApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["departments", "stats"] });
    },
  });
};
