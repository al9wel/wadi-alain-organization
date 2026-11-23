import type { BackendUser } from "./user.types";

export interface LoginCredentials {
  user_name: string;
  password: string;
  device_name?: string;
  rememberMe?: boolean;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
  device_name?: string;
}

export interface LogoutPayload {
  all_devices?: boolean;
}

export interface AuthResponseData {
  token: string;
  token_type: string;
  must_change_password: boolean;
  user: BackendUser;
}
