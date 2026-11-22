import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingPage() {
  return (
    <div className="py-20 text-center">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-5xl font-black text-foreground">
          مؤسسة وادي العين
        </h1>
        <p className="text-muted-foreground text-lg">
          المنصة الرقمية المؤسسية الموحدة لإدارة الأعمال والأنشطة
        </p>
        <div className="pt-4">
          <Link to={ROUTES.PUBLIC.AUTH}>
            <Button size="lg" className="gap-2 font-bold px-8">
              <span>الدخول إلى المنظومة</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
