import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/app/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach authentication token automatically to outgoing requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token, pendingToken } = useAuthStore.getState();
  const activeToken = token || pendingToken;

  if (activeToken && config.headers) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }
  return config;
});

// Centralized response handling and session termination on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    // Extract readable backend message if present and attach to error.message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
    error.message = message;

    return Promise.reject(error);
  }
);
