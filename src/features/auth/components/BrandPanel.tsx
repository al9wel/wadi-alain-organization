import logoImg from "@/assets/auth/logo.png";
import decorationSvg from "@/assets/auth/decoration.svg";
import { ShieldCheck, Cloud, Lock } from "lucide-react";

interface BrandPanelProps {
  className?: string;
}

export function BrandPanel({ className = "" }: BrandPanelProps) {
  return (
    <div
      className={`relative bg-[#020066] text-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16 select-none ${className}`}
      dir="ltr"
    >
      {/* Background Graphic Pattern & Left Gold Edge Line from Figma */}
      <img
        src={decorationSvg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full pointer-events-none object-cover opacity-90"
      />

      {/* Top Header: Brand Text on Left + Logo Tile on Right (matching Figma exactly) */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="text-right flex-1 space-y-1">
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
            مؤسسة وادي العين للتنمية الاجتماعية
          </h2>
          <p className="text-xs font-bold text-white/70">
            نظام إدارة الأرشيف والمشاريع التنموية
          </p>
        </div>

        <div className="size-14 sm:size-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shrink-0">
          <img
            src={logoImg}
            alt="شعار مؤسسة وادي العين للتنمية"
            className="size-full object-contain"
          />
        </div>
      </div>

      {/* Middle Content: Gold Accent, Main Slogan & Mission (Right-Aligned) */}
      <div className="relative z-10 my-auto py-10 lg:py-0 flex flex-col items-end text-right space-y-5 max-w-xl self-end">
        <div className="h-1 w-14 bg-[#cd9933] rounded-full self-end" />

        <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-white leading-[1.22] tracking-tight">
          أرشيفك المؤسسي، محفوظ بأمان ومنظَّم بذكاء
        </h1>

        <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed">
          «نعمل لغدٍ مشرق .. فساهم معنا في البناء»
        </p>

        <p className="text-xs sm:text-sm font-bold text-[#cd9933]">
          الأصالة · التنمية · الأثر المجتمعي المستدام
        </p>
      </div>

      {/* Bottom Footer: Feature Capsules & Meta Info */}
      <div className="relative z-10 space-y-4 pt-6 flex flex-col items-end w-full">
        {/* Capsules row: right-aligned */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
          {/* Capsule 3 */}
          <div className="bg-white/10 border border-white/22 rounded-full px-3 py-1.5 text-xs text-white font-bold flex items-center gap-1.5 backdrop-blur-xs">
            <span>تشفير AES-256</span>
            <Lock className="size-3.5 text-white/90" />
          </div>

          {/* Capsule 2 */}
          <div className="bg-white/10 border border-white/22 rounded-full px-3 py-1.5 text-xs text-white font-bold flex items-center gap-1.5 backdrop-blur-xs">
            <span>Amazon S3</span>
            <Cloud className="size-3.5 text-white/90" />
          </div>

          {/* Capsule 1 */}
          <div className="bg-white/10 border border-white/22 rounded-full px-3 py-1.5 text-xs text-white font-bold flex items-center gap-1.5 backdrop-blur-xs">
            <span>صلاحيات هرمية</span>
            <ShieldCheck className="size-3.5 text-white/90" />
          </div>
        </div>

        <div className="h-px w-full bg-white/15" />

        {/* Meta row: Version on Left, Secure on Right */}
        <div className="flex items-center justify-between text-xs text-white/60 font-bold w-full">
          <span>الإصدار 2.4.0</span>
          <span>بوابة مؤسسية آمنة</span>
        </div>
      </div>
    </div>
  );
}
