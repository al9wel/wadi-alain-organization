import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentApi } from "../../api/attachmentApi";

export const useUpdateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      attachmentId,
      data,
    }: {
      userId: number | string;
      attachmentId: number | string;
      data: FormData;
    }) => attachmentApi.updateAttachment(userId, attachmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-attachments"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
};
