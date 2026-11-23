import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";

export const useDepartment = (id: number | string) => {
  return useQuery({
    queryKey: ["departments", id],
    queryFn: () => departmentApi.getDepartmentById(id),
    enabled: Boolean(id),
  });
};
