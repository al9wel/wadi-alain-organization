import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, BackendUser } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  pendingToken: string | null;
  tempUser: BackendUser | null;
  setUser: (user: User | null, token?: string | null) => void;
  setPendingPasswordChange: (pendingToken: string, tempUser: BackendUser) => void;
  clearPendingPasswordChange: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      pendingToken: null,
      tempUser: null,
      setUser: (user, token = null) =>
        set((state) => ({
          user,
          token: token !== undefined ? token : state.token,
          pendingToken: null,
          tempUser: null,
        })),
      setPendingPasswordChange: (pendingToken, tempUser) =>
        set({
          pendingToken,
          tempUser,
          user: null,
          token: null,
        }),
      clearPendingPasswordChange: () =>
        set({
          pendingToken: null,
          tempUser: null,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          pendingToken: null,
          tempUser: null,
        }),
    }),
    {
      name: "wadi-alain-auth",
    }
  )
);
