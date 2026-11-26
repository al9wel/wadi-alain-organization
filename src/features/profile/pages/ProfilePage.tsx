import { Link } from "react-router-dom";
import {
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import ErrorState from "@/app/pages/ErrorState";
import { useProfile } from "../hooks/useProfile";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { ProfileDocumentsCard } from "../components/ProfileDocumentsCard";

function getDottedInitials(name?: string): string {
  if (!name || !name.trim()) return "م";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0);
  return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`;
}

export const ProfilePage = () => {
  const { user: sessionUser } = useAuth();
  const { data, isPending, isError, refetch } = useProfile();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isPending || !data?.data) {
    return (
      <div className="flex flex-col h-[340px] items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground animate-pulse text-sm">
          جاري جلب بيانات الملف الشخصي...
        </p>
      </div>
    );
  }

  const profile = data.data;
  const roleLabel = sessionUser?.role ? ROLE_LABELS[sessionUser.role] : "مستخدم النظام";
  const phoneDisplay = profile.phone || profile.user_name;

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* Page Header matching Figma (1:3895) */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Link
              to={ROUTES.DASHBOARD.ROOT}
              className="hover:text-primary transition-colors"
            >
              الحساب
            </Link>
            <ChevronLeft className="size-3 text-muted-foreground/60" />
            <span className="text-[#8f6b24] dark:text-[#e6cc99]">
              الملف الشخصي
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            الملف الشخصي
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            إدارة بياناتك الشخصية وإعدادات الأمان والمستندات المرتبطة بحسابك
          </p>
        </div>

        <EditProfileDialog profile={profile} />
      </div>

      {/* Figma Identity Card */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        {/* Top Navy Cover Banner with Gold Bottom Accent */}
        <div className="relative h-[120px] bg-[#020066] overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -left-10 size-[200px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -top-24 -left-16 size-[320px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -top-40 -left-24 size-[460px] rounded-full border border-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#cd9933]" />
        </div>

        {/* Overlapping Avatar + Identity Details */}
        <div className="relative px-6 sm:px-8 pb-6">
          {/* Avatar overlapping the cover */}
          <div className="relative -mt-12 mb-4 inline-flex">
            <div className="size-24 rounded-full bg-[#020066] border-[5px] border-card flex items-center justify-center shadow-sm select-none">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#cd9933]">
                {getDottedInitials(profile.name)}
              </span>
            </div>
            <div className="absolute bottom-1 left-0 size-7 rounded-full bg-[#cd9933] border-2 border-card flex items-center justify-center text-white">
              <Camera className="size-3.5" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Name, Department & Role */}
            <div className="space-y-2 text-right">
              <div className="flex items-center flex-wrap gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {profile.name}
                </h2>
                {profile.is_active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--feedback-success-bg)] text-[var(--feedback-success-fg)] px-2.5 py-0.5 text-[11px] font-bold">
                    <CheckCircle2 className="size-3" />
                    نشط
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-2.5 text-sm">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Building2 className="size-4 text-[#cd9933]" />
                  {profile.department?.name || "الإدارة العامة"}
                </span>
                <span className="inline-flex items-center rounded-full bg-[var(--brand-secondary-subtle)] text-[var(--text-accent)] px-3 py-1 text-xs font-bold">
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Contact Chips (Phone & Email) matching Figma */}
            <div className="flex flex-wrap items-center gap-2.5">
              {profile.email && (
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-alt border border-border px-3.5 py-2 text-xs font-bold text-foreground">
                  <Mail className="size-3.5 text-[#cd9933] shrink-0" />
                  <span dir="ltr">{profile.email}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-2 rounded-full bg-surface-alt border border-border px-3.5 py-2 text-xs font-bold text-foreground">
                <Phone className="size-3.5 text-[#cd9933] shrink-0" />
                <span className="font-mono" dir="ltr">
                  {phoneDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Subtle Metadata Strip */}
          <div className="mt-5 pt-4 border-t border-border/70 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#cd9933]" />
              <span>تاريخ الانضمام:</span>
              <span className="font-bold text-foreground">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("ar-YE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#cd9933]" />
              <span>آخر تسجيل دخول:</span>
              <span className="font-bold text-foreground">
                {profile.last_login_at
                  ? new Date(profile.last_login_at).toLocaleDateString("ar-YE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "الجلسة الحالية"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Documents & Completeness Section matching Figma */}
      <ProfileDocumentsCard
        userId={profile.id}
        hasEmail={Boolean(profile.email)}
      />
    </div>
  );
};
