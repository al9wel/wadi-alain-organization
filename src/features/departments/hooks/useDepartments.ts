import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/departmentApi";

export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentApi.getDepartments({ per_page: 100 }),
  });
};
