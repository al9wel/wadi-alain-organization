import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/authApi";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getMe(),
  });
};
