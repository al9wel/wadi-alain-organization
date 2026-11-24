import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  BackendUser,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilterParams,
  CreateUserData,
  UserStats,
} from "@/types";

export const userApi = {
  getUsers: async (params?: UserFilterParams): Promise<PaginatedResponse<BackendUser>> => {
    const response = await apiClient.get<PaginatedResponse<BackendUser>>("/users", {
      params,
    });
    return response.data;
  },

  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await apiClient.get<ApiResponse<UserStats>>("/users/stats");
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<CreateUserData>> => {
    const response = await apiClient.post<ApiResponse<CreateUserData>>("/users", data);
    return response.data;
  },

  updateUser: async (
    id: number | string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<BackendUser>> => {
    const response = await apiClient.put<ApiResponse<BackendUser>>(`/users/${id}`, data);
    return response.data;
  },

  activateUser: async (id: number | string): Promise<ApiResponse<BackendUser>> => {
    const response = await apiClient.patch<ApiResponse<BackendUser>>(`/users/${id}/activate`);
    return response.data;
  },

  deactivateUser: async (id: number | string): Promise<ApiResponse<BackendUser>> => {
    const response = await apiClient.patch<ApiResponse<BackendUser>>(`/users/${id}/deactivate`);
    return response.data;
  },
};
