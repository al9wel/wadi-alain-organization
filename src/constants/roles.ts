/**
 * System roles definition.
 */
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DATA_ENTRY: "DATA_ENTRY",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: "مدير النظام",
  [ROLES.MANAGER]: "مدير",
  [ROLES.DATA_ENTRY]: "مدخل بيانات",
  [ROLES.USER]: "مستخدم",
} as const;
