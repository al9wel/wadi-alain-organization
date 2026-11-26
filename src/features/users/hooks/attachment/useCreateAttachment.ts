import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentApi } from "../../api/attachmentApi";

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number | string; data: FormData }) =>
      attachmentApi.createAttachment(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-attachments"] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
};
