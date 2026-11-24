import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/userApi";
import type { CreateUserRequest } from "@/types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
