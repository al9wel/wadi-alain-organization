import { useAuthStore } from "@/app/store/auth.store";
import type { User } from "@/types/user";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    isAuthenticated: Boolean(user),
    setUser,
    logout,
  };
}
