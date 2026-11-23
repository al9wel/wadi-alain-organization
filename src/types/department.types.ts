export interface Department {
  id: number | string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentStats {
  departments_count: number;
  active_departments_count: number;
  inactive_departments_count: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface DepartmentFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}
