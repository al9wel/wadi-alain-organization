import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/userApi";

export const useUserStats = () => {
  return useQuery({
    queryKey: ["users", "stats"],
    queryFn: () => userApi.getUserStats(),
    staleTime: 3 * 60 * 1000,
  });
};
