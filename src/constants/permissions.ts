import { ROLES, type Role } from "./roles";

/**
 * Granular business actions.
 */
export const ACTIONS = {
  // Main Page Permissions
  VIEW_MAIN: "VIEW_MAIN",
  CREATE_MAIN: "CREATE_MAIN",
  UPDATE_MAIN: "UPDATE_MAIN",
  DELETE_MAIN: "DELETE_MAIN",

  // Settings Permissions
  VIEW_SETTINGS: "VIEW_SETTINGS",
} as const;

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

/**
 * Centralized Action-to-Roles Permissions Matrix.
 * Maps each business action to the roles authorized to execute it.
 */
export const PERMISSIONS: Record<Action, readonly Role[]> = {
  // Main Page Permissions
  [ACTIONS.VIEW_MAIN]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DATA_ENTRY],
  [ACTIONS.CREATE_MAIN]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DATA_ENTRY],
  [ACTIONS.UPDATE_MAIN]: [ROLES.ADMIN, ROLES.MANAGER],
  [ACTIONS.DELETE_MAIN]: [ROLES.ADMIN],

  // Settings Permissions
  [ACTIONS.VIEW_SETTINGS]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.DATA_ENTRY, ROLES.USER],
} as const;
