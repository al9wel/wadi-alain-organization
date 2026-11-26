export interface UserAttachmentRefUser {
  id: number;
  name: string;
}

export interface UserAttachment {
  id: number;
  user_id: number;
  user?: UserAttachmentRefUser | null;
  name: string;
  uploaded_by?: UserAttachmentRefUser | null;
  file_url: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserAttachmentFilterParams {
  user_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}
