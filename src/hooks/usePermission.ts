import { useAuth } from "./useAuth";
import { PERMISSIONS, type Action } from "@/constants/permissions";

export function usePermission(action: Action): boolean {
  const { user } = useAuth();
  if (!user) return false;

  const allowedRoles = PERMISSIONS[action];
  if (!allowedRoles) return false;

  return allowedRoles.includes(user.role);
}
