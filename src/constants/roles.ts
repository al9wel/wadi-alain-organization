import type { Role } from "@/types/role.types";

export type { Role };

/**
 * System roles definition.
 */
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DATA_ENTRY: "DATA_ENTRY",
  USER: "USER",
} as const satisfies Record<Role, Role>;

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: "مدير النظام",
  [ROLES.MANAGER]: "مدير",
  [ROLES.DATA_ENTRY]: "مدخل بيانات",
  [ROLES.USER]: "مستخدم",
} as const;
