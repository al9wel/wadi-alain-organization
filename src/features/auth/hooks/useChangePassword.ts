import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { ChangePasswordPayload } from "@/types";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authApi.changePassword(payload),
  });
};
