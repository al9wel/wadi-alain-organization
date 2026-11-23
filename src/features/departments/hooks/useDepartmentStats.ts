import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";

export const useDepartmentStats = () => {
  return useQuery({
    queryKey: ["departments", "stats"],
    queryFn: () => departmentApi.getDepartmentStats(),
    staleTime: 3 * 60 * 1000,
  });
};
