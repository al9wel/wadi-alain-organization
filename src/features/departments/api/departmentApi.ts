import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  Department,
  DepartmentStats,
  DepartmentFilterParams,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/types";

export const departmentApi = {
  getDepartments: async (
    params?: DepartmentFilterParams
  ): Promise<PaginatedResponse<Department>> => {
    const response = await apiClient.get<PaginatedResponse<Department>>("/departments", {
      params,
    });
    return response.data;
  },

  getDepartmentStats: async (): Promise<ApiResponse<DepartmentStats>> => {
    const response = await apiClient.get<ApiResponse<DepartmentStats>>("/departments/stats");
    return response.data;
  },

  getDepartmentById: async (id: number | string): Promise<ApiResponse<Department>> => {
    const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (
    data: CreateDepartmentRequest
  ): Promise<ApiResponse<Department>> => {
    const response = await apiClient.post<ApiResponse<Department>>("/departments", data);
    return response.data;
  },

  updateDepartment: async (
    id: number | string,
    data: UpdateDepartmentRequest
  ): Promise<ApiResponse<Department>> => {
    const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, data);
    return response.data;
  },

  activateDepartment: async (id: number | string): Promise<ApiResponse<Department>> => {
    const response = await apiClient.patch<ApiResponse<Department>>(
      `/departments/${id}/activate`
    );
    return response.data;
  },

  deactivateDepartment: async (id: number | string): Promise<ApiResponse<Department>> => {
    const response = await apiClient.patch<ApiResponse<Department>>(
      `/departments/${id}/deactivate`
    );
    return response.data;
  },

  deleteDepartment: async (id: number | string): Promise<ApiResponse<Department>> => {
    const response = await apiClient.delete<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },
};
