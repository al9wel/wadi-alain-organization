import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import type { LogoutPayload } from "@/types";

export const useLogout = () => {
  const { logout: clearSession } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: LogoutPayload) => authApi.logout(payload),
    onSuccess: (data) => {
      clearSession();
      queryClient.clear();
      toast.success(data?.message || "تم تسجيل الخروج بنجاح");
      navigate(ROUTES.PUBLIC.AUTH, { replace: true });
    },
    onError: () => {
      clearSession();
      queryClient.clear();
      toast.info("تم إنهاء الجلسة محلياً");
      navigate(ROUTES.PUBLIC.AUTH, { replace: true });
    },
  });
};
