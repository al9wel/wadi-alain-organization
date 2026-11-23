import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import logoImg from "@/assets/logo.png";

export function PublicFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-card text-foreground transition-colors" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-card border border-border flex items-center justify-center p-1.5 shadow-xs shrink-0">
                <img
                  src={logoImg}
                  alt="شعار مؤسسة وادي العين"
                  className="size-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-foreground leading-tight">
                  مؤسسة وادي العين
                </span>
                <span className="font-bold text-xs text-[#8f6b24] dark:text-[#e6cc99] leading-tight">
                  للتنمية المجتمعية
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              نظام إدارة الأرشيف والمشاريع التنموية — حل مؤسسي موحد لحفظ الوثائق وتنظيم الأعمال وتعزيز الحوكمة المؤسسية.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-foreground">روابط سريعة</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  المميزات الأساسية
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-primary transition-colors">
                  البنية البرمجية والتقنية
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-primary transition-colors">
                  إحصائيات المنظومة
                </a>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.AUTH} className="hover:text-primary transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: System Security & Standards */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-foreground">الأمان والموثوقية</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>تشفير سحابي متوافق AES-256</li>
              <li>روابط تحميل مؤقتة وآمنة Pre-signed URLs</li>
              <li>صلاحيات الوصول المعتمدة على الأدوار RBAC</li>
              <li>سجل تتبع لحظي لكافة العمليات</li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-foreground">التواصل والموقع</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              حضرموت — وادي العين، الجمهورية اليمنية
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              البريد: info@wadialain.org
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              الهاتف: +967 770 000 000
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-right">
          <p>© {new Date().getFullYear()} مؤسسة وادي العين للتنمية المجتمعية — جميع الحقوق محفوظة.</p>
          <p className="text-[11px]">نظام الأرشفة وإدارة المشروعات الرقمي v1.0</p>
        </div>
      </div>
    </footer>
  );
}
