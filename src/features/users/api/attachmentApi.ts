import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  PaginatedResponse,
  UserAttachment,
  UserAttachmentFilterParams,
} from "@/types";

export const attachmentApi = {
  getAttachments: async (
    params?: UserAttachmentFilterParams
  ): Promise<PaginatedResponse<UserAttachment>> => {
    const response = await apiClient.get<PaginatedResponse<UserAttachment>>(
      "/users/attachments",
      { params }
    );
    return response.data;
  },

  getUserAttachments: async (
    userId: number | string,
    params?: Omit<UserAttachmentFilterParams, "user_id">
  ): Promise<PaginatedResponse<UserAttachment>> => {
    const response = await apiClient.get<PaginatedResponse<UserAttachment>>(
      `/users/${userId}/attachments`,
      { params }
    );
    return response.data;
  },

  getAttachment: async (
    userId: number | string,
    attachmentId: number | string
  ): Promise<ApiResponse<UserAttachment>> => {
    const response = await apiClient.get<ApiResponse<UserAttachment>>(
      `/users/${userId}/attachments/${attachmentId}`
    );
    return response.data;
  },

  createAttachment: async (
    userId: number | string,
    data: FormData
  ): Promise<ApiResponse<UserAttachment>> => {
    const response = await apiClient.post<ApiResponse<UserAttachment>>(
      `/users/${userId}/attachments`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateAttachment: async (
    userId: number | string,
    attachmentId: number | string,
    data: FormData
  ): Promise<ApiResponse<UserAttachment>> => {
    data.append("_method", "PUT");
    const response = await apiClient.post<ApiResponse<UserAttachment>>(
      `/users/${userId}/attachments/${attachmentId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteAttachment: async (
    userId: number | string,
    attachmentId: number | string
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/users/${userId}/attachments/${attachmentId}`
    );
    return response.data;
  },

  getDownloadUrl: (fileUrl: string): string => {
    if (!fileUrl) return "";
    return `${fileUrl}${fileUrl.includes("?") ? "&" : "?"}download=1`;
  },
};
