import { Link } from "react-router-dom";
import { Building2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={ROUTES.PUBLIC.ROOT} className="flex items-center gap-3 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-base text-foreground">
            مؤسسة وادي العين
          </span>
        </Link>

        <Link to={ROUTES.PUBLIC.AUTH}>
          <Button size="sm" className="gap-2 font-bold">
            <LogIn className="h-4 w-4" />
            <span>تسجيل الدخول</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
