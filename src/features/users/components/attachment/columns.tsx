import type { ColumnDef } from "@tanstack/react-table";
import { Download, ExternalLink, Paperclip } from "lucide-react";
import { attachmentApi } from "../../api/attachmentApi";
import { AttachmentActions } from "./AttachmentActions";
import type { UserAttachment } from "@/types";

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "م";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0);
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
}

export const columns: ColumnDef<UserAttachment>[] = [
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-muted-foreground">
        #{row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "عنوان الملحق",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
          <Paperclip className="size-4" />
        </div>
        <span className="text-sm font-bold text-foreground truncate">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    id: "user",
    header: "المستخدم",
    filterFn: (row, _columnId, filterValue: string) => {
      if (!filterValue || filterValue === "all") return true;
      return String(row.original.user_id) === filterValue;
    },
    cell: ({ row }) => {
      const userName = row.original.user?.name || `مستخدم #${row.original.user_id}`;
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-7 rounded-full bg-surface-alt border border-border flex items-center justify-center text-[11px] font-extrabold text-primary shrink-0">
            {getInitials(userName)}
          </div>
          <span className="text-xs font-bold text-foreground truncate">
            {userName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "تاريخ الإضافة",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString("ar-YE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—"}
      </span>
    ),
  },
  {
    id: "file",
    header: "الملف",
    cell: ({ row }) => {
      const fileUrl = row.original.file_url;
      if (!fileUrl) return <span className="text-xs text-muted-foreground">—</span>;
      const downloadUrl = attachmentApi.getDownloadUrl(fileUrl);

      return (
        <div className="flex items-center gap-1.5">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary hover:opacity-85 transition-opacity"
          >
            <ExternalLink className="size-3" />
            <span>عرض</span>
          </a>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-surface-alt border border-border px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-muted/60 transition-colors"
          >
            <Download className="size-3" />
            <span>تحميل</span>
          </a>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => <AttachmentActions attachment={row.original} />,
  },
];
