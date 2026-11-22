/**
 * Centralized Route Map for Wadi Al-Ain System.
 */
export const ROUTES = {
  PUBLIC: {
    ROOT: "/",
    AUTH: "/auth",
    UNAUTHORIZED: "/unauthorized",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    SETTINGS: "/dashboard/settings",
  },
} as const;
