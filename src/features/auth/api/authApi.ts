import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  AuthResponseData,
  BackendUser,
  ChangePasswordPayload,
  LoginCredentials,
  LogoutPayload,
} from "@/types";

export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    "/auth/login",
    {
      user_name: credentials.user_name.trim(),
      password: credentials.password,
      device_name: credentials.device_name || "web_portal",
    }
  );
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    "/auth/change-password",
    {
      current_password: payload.current_password,
      new_password: payload.new_password,
      new_password_confirmation: payload.new_password_confirmation,
      device_name: payload.device_name || "web_portal",
    }
  );
  return response.data;
};

export const logout = async (
  payload?: LogoutPayload
): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>("/auth/logout", {
    all_devices: payload?.all_devices ?? false,
  });
  return response.data;
};

export const getMe = async (): Promise<ApiResponse<BackendUser>> => {
  const response = await apiClient.get<ApiResponse<BackendUser>>("/auth/me");
  return response.data;
};

export const authApi = {
  login,
  changePassword,
  logout,
  getMe,
};
