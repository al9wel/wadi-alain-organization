import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import logoImg from "@/assets/logo.png";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "المميزات", href: "#features" },
    { label: "البنية التقنية", href: "#architecture" },
    { label: "الأرقام", href: "#stats" },
    { label: "تواصل معنا", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md transition-colors" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 h-[72px] sm:h-[81px] flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to={ROUTES.PUBLIC.ROOT} className="flex items-center gap-3 select-none shrink-0">
          <div className="size-11 sm:size-12 rounded-2xl bg-card border border-border flex items-center justify-center p-1.5 shadow-xs shrink-0">
            <img
              src={logoImg}
              alt="شعار مؤسسة وادي العين"
              className="size-full object-contain"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-extrabold text-sm sm:text-base text-foreground leading-tight">
              مؤسسة وادي العين
            </span>
            <span className="font-bold text-[11px] sm:text-xs text-[#8f6b24] dark:text-[#e6cc99] leading-tight">
              للتنمية المجتمعية
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors select-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions (Login & Theme) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link to={ROUTES.PUBLIC.AUTH} className="hidden sm:inline-flex">
            <Button
              className="h-[42px] px-5 sm:px-6 rounded-2xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>دخول النظام</span>
              <LogIn className="size-4 shrink-0" />
            </Button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-border sm:hidden">
            <Link to={ROUTES.PUBLIC.AUTH} onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold gap-2">
                <span>دخول النظام</span>
                <LogIn className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
