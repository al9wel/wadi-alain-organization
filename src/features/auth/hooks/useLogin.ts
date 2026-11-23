import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { LoginCredentials } from "@/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
};
