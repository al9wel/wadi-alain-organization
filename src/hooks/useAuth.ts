import { useAuthStore } from "@/app/store/auth.store";
import type { User, BackendUser } from "@/types";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  pendingToken: string | null;
  tempUser: BackendUser | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  setUser: (user: User | null, token?: string | null) => void;
  setPendingPasswordChange: (pendingToken: string, tempUser: BackendUser) => void;
  clearPendingPasswordChange: () => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const pendingToken = useAuthStore((state) => state.pendingToken);
  const tempUser = useAuthStore((state) => state.tempUser);
  const setUser = useAuthStore((state) => state.setUser);
  const setPendingPasswordChange = useAuthStore(
    (state) => state.setPendingPasswordChange
  );
  const clearPendingPasswordChange = useAuthStore(
    (state) => state.clearPendingPasswordChange
  );
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    pendingToken,
    tempUser,
    isAuthenticated: Boolean(user && token),
    mustChangePassword: Boolean(pendingToken && !user),
    setUser,
    setPendingPasswordChange,
    clearPendingPasswordChange,
    logout,
  };
}
