import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  FolderLock,
  Cloud,
  Search,
  History,
  Trash2,
  Folder,
  FileText,
  CheckCircle2,
  Layers,
  Code2,
  Database,
  Building2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingPage() {
  const features = [
    {
      icon: ShieldCheck,
      title: "صلاحيات دقيقة RBAC",
      desc: "أذونات مخصصة للمدراء، مشرفي الأقسام، والمستخدمين مع سجل كامل لجميع العمليات والتحقق الصارم في كل إجراء.",
      tag: "حوكمة الوصول",
    },
    {
      icon: Cloud,
      title: "تخزين سحابي آمن (S3)",
      desc: "حفظ الوثائق بتشفير متقدم، مع روابط مؤقتة آمنة ومحمية لتحميل المستندات المؤسسية.",
      tag: "أمان المستندات",
    },
    {
      icon: FolderLock,
      title: "مجلدات هرمية متكاملة",
      desc: "تنظيم الملفات بنظام شجرة المجلدات لتسهيل استرجاع الوثائق وتصنيفها حسب الأقسام والمشاريع.",
      tag: "تنظيم هيكلي",
    },
    {
      icon: Search,
      title: "بحث متقدم وسريع",
      desc: "البحث الدقيق بالاسم، القسم، التاريخ، ونوع الملف مع فلاتر ذكية متعددة المعايير.",
      tag: "استرجاع فوري",
    },
    {
      icon: History,
      title: "سجل العمليات والنشاطات",
      desc: "توثيق لحظي لكل إجراء إضافة، تعديل، حذف، أو استرجاع مع وقت التنفيذ الدقيق وهوية المنفّذ.",
      tag: "تدقيق شامل",
    },
    {
      icon: Trash2,
      title: "استرجاع آمن وحماية من الفقدان",
      desc: "سلة محذوفات متقدمة تتيح استعادة الملفات والمجلدات مع الحفاظ على هيكلها الأصلي وتصنيفاتها.",
      tag: "حماية البيانات",
    },
  ];

  const pillars = [
    {
      title: "الحوكمة والمساءلة",
      desc: "فصل واضح بين الصلاحيات التنفيذية والرقابية لضمان سلامة العمل المؤسسي.",
      icon: ShieldCheck,
    },
    {
      title: "الأرشفة الرقمية الموحدة",
      desc: "مستودع مركزي آمن وموثق لجميع وثائق ومشاريع مؤسسة وادي العين.",
      icon: Building2,
    },
    {
      title: "التكامل والمرونة البرمجية",
      desc: "بنية برمجية معيارية قابلة للتوسع والتطوير لتلبية متطلبات المستقبل.",
      icon: Layers,
    },
    {
      title: "أعلى معايير التشفير والسرية",
      desc: "حماية تامة للملفات والبيانات أثناء النقل والتخزين عبر أحدث المعايير الأمنية.",
      icon: Lock,
    },
  ];

  const architectures = [
    {
      icon: Layers,
      title: "Laravel + Modular Architecture",
      category: "الواجهة الخلفية (Backend)",
      desc: "بنية نمطية متقدمة تفصل نطاقات العمل لضمان الصيانة السلسة والتوسع الموثوق وفصل المسؤوليات بدقة.",
    },
    {
      icon: Code2,
      title: "React 19 + TypeScript + Tailwind",
      category: "الواجهة الأمامية (Frontend)",
      desc: "واجهة مستخدم تفاعلية فائقة السرعة مع تدقيق صارم للأنواع، وتطبيق دقيق لهوية تصميم مؤسسة وادي العين.",
    },
    {
      icon: Database,
      title: "PostgreSQL + S3 Storage",
      category: "قواعد البيانات والتخزين",
      desc: "قواعد بيانات علائقية متينة للعلاقات والصلاحيات، وتخزين سحابي آمن ومشفر للوثائق والمستندات.",
    },
  ];

  return (
    <div className="w-full bg-background text-foreground" dir="rtl">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative border-b border-border py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-16 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Right Column: Hero Pitch (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-secondary border border-border text-xs font-bold text-foreground">
                <span className="size-2 rounded-full bg-primary" />
                <span>منظومة إدارة الأرشيف والمشاريع التنموية</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.25]">
                منظومة رقمية متكاملة لإدارة الأرشيف والتنمية المجتمعية
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                منصة مؤسسية تجمع بين أرشفة الوثائق وإدارة المشاريع والصلاحيات متعددة المستويات لتنظيم العمل وتعزيز الشفافية والحوكمة في مؤسسة وادي العين.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to={ROUTES.PUBLIC.AUTH}>
                  <Button
                    size="lg"
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm gap-2 shadow-sm cursor-pointer"
                  >
                    <span>دخول النظام</span>
                    <ArrowLeft className="size-4" />
                  </Button>
                </Link>

                <a href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 rounded-xl border-border bg-card hover:bg-secondary text-foreground font-bold text-sm cursor-pointer"
                  >
                    استكشاف المميزات
                  </Button>
                </a>
              </div>

              {/* Quick Value Props */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>أرشفة منظمة</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>صلاحيات دقيقة</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>تخزين مشفّر</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>سجل نشاط متكامل</span>
                </div>
              </div>
            </div>

            {/* Left Column: Authentic UI Preview Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="w-full max-w-lg mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-right">
                {/* Clean Professional Header */}
                <div className="bg-surface px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">معاينة بنية الأرشيف المؤسسي</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-[11px] font-bold text-primary">
                    <FolderLock className="size-3.5" />
                    <span>مجلدات نشطة</span>
                  </span>
                </div>

                {/* Preview Content */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Root Section */}
                  <div className="p-3.5 rounded-xl bg-secondary/80 border border-border flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      نشط
                    </span>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">الأرشيف المركزي للمؤسسة</p>
                        <p className="text-[11px] text-muted-foreground">شجرة المجلدات والوثائق المعتمدة</p>
                      </div>
                      <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Folder className="size-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Subfolders Tree */}
                  <div className="pr-4 border-r-2 border-border space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between hover:bg-secondary/40 transition-colors">
                      <span className="text-muted-foreground">وثائق رسمية</span>
                      <span className="font-bold text-foreground">إدارة الموارد البشرية</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between hover:bg-secondary/40 transition-colors">
                      <span className="text-muted-foreground">تقارير مالية</span>
                      <span className="font-bold text-foreground">الإدارة المالية والموازنة</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between hover:bg-secondary/40 transition-colors">
                      <span className="text-muted-foreground">خطط ومشاريع</span>
                      <span className="font-bold text-foreground">المشاريع والتنمية الاجتماعية</span>
                    </div>
                  </div>

                  {/* Sample File Row */}
                  <div className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">وثيقة معتمدة وموقعة</span>
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <span>خطة_المشاريع_المعتمدة_2026.pdf</span>
                      <FileText className="size-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURES SECTION ── */}
      <section id="features" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-16 border-b border-border bg-card/40">
        <div className="container mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary border border-border text-xs font-bold text-foreground">
              <span>إمكانيات المنظومة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              أدوات مصممة لخدمة بيئة العمل المؤسسي
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              حلول مرنة ومدروسة لإدارة الأرشيف الإلكتروني وتسهيل الوصول الآمن للبيانات والمعلومات.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-4 hover:border-primary/40 transition-colors text-right flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center">
                      <Icon className="size-5.5" />
                    </div>
                    <h3 className="text-base font-extrabold text-foreground">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border text-xs font-bold text-primary">
                    <span>{feat.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. ORGANIZATIONAL PILLARS (Replaces fake metric numbers) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-16 bg-[#020066] text-white">
        <div className="container mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              الركائز الأساسية لإدارة الأرشيف والتنمية
            </h2>
            <p className="text-sm text-white/80">
              مبادئ العمل المعتمدة في بناء المنظومة لضمان الاستمرارية والاعتمادية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-3 text-right backdrop-blur-xs"
                >
                  <div className="size-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. ARCHITECTURE SECTION ── */}
      <section id="architecture" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-16 border-b border-border bg-background">
        <div className="container mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary border border-border text-xs font-bold text-foreground">
              <span>البنية التقنية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              معمارية تقنية موثوقة وحديثة
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              تقنيات متطورة تضمن الأداء العالي والأمان وفصل المسؤوليات بدقة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architectures.map((arch) => {
              const Icon = arch.icon;
              return (
                <div
                  key={arch.title}
                  className="bg-card border border-border rounded-2xl p-6 sm:p-7 space-y-3 text-right hover:border-primary/40 transition-colors"
                >
                  <div className="size-11 rounded-xl bg-secondary text-primary flex items-center justify-center">
                    <Icon className="size-5.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#8f6b24] dark:text-[#e6cc99] block">
                    {arch.category}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground">{arch.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {arch.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CTA SECTION ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-16 bg-card/60 border-b border-border text-center">
        <div className="container mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
            منظومة وادي العين لإدارة الأرشيف الرقمي
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            بوابة رقمية مخصصة لأعضاء وكوادر مؤسسة وادي العين لتنظيم وتوثيق الأنشطة والمشاريع والمستندات الرسمية.
          </p>
          <div className="pt-2">
            <Link to={ROUTES.PUBLIC.AUTH}>
              <Button
                size="lg"
                className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm gap-2 shadow-sm cursor-pointer"
              >
                <span>دخول النظام</span>
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
