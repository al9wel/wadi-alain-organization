/**
 * Centralized Route Map for Wadi Al-Ain System.
 */
export const ROUTES = {
  PUBLIC: {
    ROOT: "/",
    AUTH: "/auth",
    CHANGE_PASSWORD: "/auth/change-password",
    PASSWORD_CHANGED: "/auth/password-changed",
    UNAUTHORIZED: "/unauthorized",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    DEPARTMENTS: "/dashboard/departments",
    USERS: "/dashboard/users",
    ACTIVITY_LOGS: "/dashboard/activity-logs",
    SETTINGS: "/dashboard/settings",
  },
} as const;
