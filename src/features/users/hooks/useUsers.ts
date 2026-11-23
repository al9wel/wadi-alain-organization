import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { UserFilterParams } from "@/types";

export const useUsers = (params?: UserFilterParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    staleTime: 2 * 60 * 1000,
  });
};
