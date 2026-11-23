import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-context";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  className = "",
  variant = "ghost",
  size = "icon",
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`relative rounded-xl cursor-pointer transition-colors ${className}`}
      title={resolvedTheme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
      aria-label="تبديل مظهر النظام"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-4.5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="size-4.5 text-slate-700 dark:text-slate-300 transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
