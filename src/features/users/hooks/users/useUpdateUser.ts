import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import type { UpdateUserRequest } from "@/types";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
