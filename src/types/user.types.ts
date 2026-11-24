import type { Role } from "./role.types";
import { ROLES } from "@/constants/roles";

/**
 * Normalized user model consumed by frontend views, layouts, and hooks.
 */
export interface User {
  id: string | number;
  name: string;
  phone?: string;
  user_name?: string;
  email?: string | null;
  role: Role;
  department?: string | null;
  departmentId?: number | string | null;
  isActive?: boolean;
  createdAt?: string;
}

/**
 * Raw User resource structure returned from the Laravel backend API.
 */
export interface BackendUser {
  id: number | string;
  name: string;
  phone: string;
  user_name: string;
  email: string | null;
  is_active: boolean;
  must_change_password: boolean;
  department?: { id: number | string; name: string } | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  name: string;
  phone: string;
  email?: string | null;
  department_id?: number | string | null;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string | null;
  department_id?: number | string | null;
}

export interface UserStats {
  users_count: number;
  active_users_count: number;
  inactive_users_count: number;
}

export interface UserFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
  department_id?: number | string;
}

export interface CreateUserData {
  user: BackendUser;
  temporary_password?: string;
}

/**
 * Central user normalization helper:
 * Converts raw BackendUser into the frontend User domain model.
 * Assigns temporary central ADMIN role until backend RBAC module is connected.
 */
export function normalizeUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    phone: backendUser.phone,
    user_name: backendUser.user_name,
    email: backendUser.email,
    role: ROLES.ADMIN,
    department: backendUser.department?.name ?? null,
    departmentId: backendUser.department?.id ?? null,
    isActive: backendUser.is_active,
    createdAt: backendUser.created_at,
  };
}
