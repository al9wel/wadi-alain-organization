import { useQuery } from "@tanstack/react-query";
import { attachmentApi } from "../../api/attachmentApi";

export const useAttachment = (
  userId: number | string | null,
  attachmentId: number | string | null,
  enabled = false
) => {
  return useQuery({
    queryKey: ["user-attachments", "detail", userId, attachmentId],
    queryFn: () =>
      attachmentApi.getAttachment(
        userId as number | string,
        attachmentId as number | string
      ),
    enabled: enabled && userId !== null && attachmentId !== null,
  });
};
