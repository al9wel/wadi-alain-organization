import { useQuery } from "@tanstack/react-query";
import { attachmentApi } from "../../api/attachmentApi";

export const useAttachments = () => {
  return useQuery({
    queryKey: ["user-attachments"],
    queryFn: () => attachmentApi.getAttachments({ per_page: 100 }),
  });
};

export const useUserAttachments = (userId: number | string | null, enabled = true) => {
  return useQuery({
    queryKey: ["user-attachments", "user", userId],
    queryFn: () => attachmentApi.getUserAttachments(userId as number | string, { per_page: 100 }),
    enabled: enabled && userId !== null && userId !== "",
  });
};
