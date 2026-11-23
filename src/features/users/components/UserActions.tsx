import { useState } from "react";
import { ArrowLeft, Copy, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserViewDialog } from "./UserViewDialog";
import type { BackendUser } from "@/types";
import { cn } from "@/lib/utils";

interface UserActionsProps {
  user: BackendUser;
}

export function UserActions({ user }: UserActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);

  const isActive = user.is_active;
  const phoneDisplay = user.phone || user.user_name;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneDisplay);
    toast.success("تم نسخ رقم الهاتف بنجاح");
  };

  const handleToggleStatus = () => {
    toast.info(
      `تغيير حالة المستخدم (${user.name}) سيتوفر فور دعم الواجهة البرمجية (API) في الخادم.`
    );
  };

  return (
    <>
      <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 shrink-0 justify-end">
        {/* Status Toggle Pill (UI-only until backend endpoint exists) */}
        <div
          className={cn(
            "h-11 px-3.5 rounded-xl flex items-center gap-3 select-none transition-colors",
            isActive
              ? "bg-[#e8f5ee] dark:bg-emerald-950/40"
              : "bg-[#fcebea] dark:bg-red-950/35"
          )}
        >
          <span
            className={cn(
              "text-xs font-extrabold min-w-[34px] text-center",
              isActive
                ? "text-[#1b7a4b] dark:text-emerald-400"
                : "text-[#c23b2b] dark:text-red-400"
            )}
          >
            {isActive ? "نشط" : "موقوف"}
          </span>

          <Switch
            checked={isActive}
            onCheckedChange={handleToggleStatus}
            aria-label={isActive ? "إيقاف المستخدم" : "تفعيل المستخدم"}
          />
        </div>

        {/* Primary CTA Button: عرض الحساب */}
        <Button
          type="button"
          onClick={() => setIsViewOpen(true)}
          className={cn(
            "h-11 px-4 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-none",
            isActive
              ? "bg-primary hover:bg-primary-hover text-primary-foreground"
              : "bg-[#e5e7ef] hover:bg-[#dcdfea] dark:bg-muted/80 dark:hover:bg-muted text-muted-foreground"
          )}
        >
          <span>عرض الحساب</span>
          <ArrowLeft className="size-4" />
        </Button>

        {/* Copy Phone Icon Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopyPhone}
          title="نسخ رقم الهاتف"
          className="size-11 rounded-xl border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
        >
          <Copy className="size-4" />
        </Button>

        {/* More Menu Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="المزيد من الخيارات"
              className="size-11 rounded-xl border-border bg-card hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => setIsViewOpen(true)}
              className="gap-2 text-xs font-bold"
            >
              <Eye className="size-3.5 text-muted-foreground" />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCopyPhone}
              className="gap-2 text-xs font-bold"
            >
              <Copy className="size-3.5 text-muted-foreground" />
              نسخ رقم الهاتف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UserViewDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        user={user}
      />
    </>
  );
}
