import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  BackendUser,
  CreateUserRequest,
  UserFilterParams,
  CreateUserData,
} from "@/types";

export const userApi = {
  getUsers: async (params?: UserFilterParams): Promise<PaginatedResponse<BackendUser>> => {
    const response = await apiClient.get<PaginatedResponse<BackendUser>>("/users", {
      params,
    });
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<CreateUserData>> => {
    const response = await apiClient.post<ApiResponse<CreateUserData>>("/users", data);
    return response.data;
  },
};
