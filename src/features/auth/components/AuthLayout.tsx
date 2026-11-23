import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandPanel } from "./BrandPanel";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import logoImg from "@/assets/logo.png";

interface AuthLayoutProps {
  children: ReactNode;
  showBackLink?: boolean;
}

export function AuthLayout({ children, showBackLink = true }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen w-full bg-background flex flex-col lg:flex-row items-stretch overflow-x-hidden transition-colors"
      dir="ltr"
    >
      {/* 1. LEFT COLUMN: Form Side (centered card on canvas) */}
      <main
        className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 lg:p-12 min-h-screen"
        dir="rtl"
      >
        {/* Top Controls: Return to Landing & Theme Toggle */}
        <div className="w-full flex items-center justify-between max-w-[460px] pt-2">
          {showBackLink ? (
            <Link
              to={ROUTES.PUBLIC.ROOT}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors select-none"
            >
              <ArrowRight className="size-3.5" />
              <span>العودة للرئيسية</span>
            </Link>
          ) : (
            <div />
          )}
          <ThemeToggle />
        </div>

        {/* Center Card */}
        <div className="w-full flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[460px] bg-card border border-border rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-300">
            {children}
          </div>
        </div>

        {/* Global Copyright Footer */}
        <footer className="text-xs font-bold text-muted-foreground text-center py-2 select-none">
          © {new Date().getFullYear()} مؤسسة وادي العين للتنمية — جميع الحقوق محفوظة
        </footer>
      </main>

      {/* 2. RIGHT COLUMN: Brand Panel */}
      <BrandPanel className="shrink-0 lg:w-[540px] xl:w-[620px] min-h-screen hidden lg:flex" />

      {/* Mobile Branding Bar (Visible only on screens below lg) */}
      <div
        className="lg:hidden bg-[#020066] text-white p-4 sm:p-5 flex items-center justify-between order-first"
        dir="rtl"
      >
        <div className="text-right">
          <p className="text-sm font-extrabold text-white">
            مؤسسة وادي العين للتنمية الاجتماعية
          </p>
          <p className="text-[11px] text-white/70">
            نظام إدارة الأرشيف والمشاريع التنموية
          </p>
        </div>
        <div className="size-11 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
          <img src={logoImg} alt="شعار" className="size-full object-contain" />
        </div>
      </div>
    </div>
  );
}
