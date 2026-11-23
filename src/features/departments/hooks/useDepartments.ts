import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";
import type { DepartmentFilterParams } from "@/types";

export const useDepartments = (params?: DepartmentFilterParams) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentApi.getDepartments(params),
    staleTime: 2 * 60 * 1000,
  });
};
