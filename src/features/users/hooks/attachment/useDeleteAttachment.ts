import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentApi } from "../../api/attachmentApi";

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      attachmentId,
    }: {
      userId: number | string;
      attachmentId: number | string;
    }) => attachmentApi.deleteAttachment(userId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-attachments"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
};
