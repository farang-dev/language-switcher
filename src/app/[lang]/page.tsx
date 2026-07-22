import Link from "next/link";
import Script from "next/script";
import { Globe, Check } from "lucide-react";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { TypingGreeting } from "@/components/ui/typing-greeting";


export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://language-switcher-two.vercel.app";

  return (
    <>
      <Script
        src={`${appUrl}/api/widget/01cf0e566c4b702f8bc34e79e42dc04d.js`}
        strategy="lazyOnload"
      />
      <div className="flex flex-col min-h-screen">
        <Header dict={dict} lang={lang} activePage="home" />
        <Hero dict={dict} lang={lang} />
        <FactbaseSection dict={dict} />
        <HowItWorksSection dict={dict} appUrl={appUrl} />
        <FeaturesSection dict={dict} />
        <PricingSection dict={dict} lang={lang} />
        <CtaSection dict={dict} lang={lang} />
        <Footer dict={dict} lang={lang} />
      </div>
    </>
  );
}

function Hero({ dict, lang }: { dict: any; lang: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e6f7f1] via-white to-[#f0faf6]" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00a67e]/5 rounded-full blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="block">
              <TypingGreeting />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.15]">
              <span className="text-[#00a67e]">{dict.hero.titleAccent}</span>
              <br />
              {dict.hero.title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-gray-500 leading-relaxed max-w-lg">
              {dict.hero.description}
            </p>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-lg">
              {dict.hero.painPoint}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center md:items-start gap-3">
              <Link
                href={`/${lang}/signup`}
                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-7 py-3 rounded-full shadow-lg shadow-[#00a67e]/25 hover:shadow-xl hover:shadow-[#00a67e]/30 hover:-translate-y-0.5"
              >
                {dict.hero.ctaStart}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 transition-all px-7 py-3 rounded-full"
              >
                {dict.hero.ctaHow}
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200 overflow-hidden w-full max-w-sm">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-100 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-50 rounded w-full" />
                  <div className="h-3 bg-gray-50 rounded w-5/6" />
                  <div className="h-3 bg-gray-50 rounded w-2/3" />
                </div>
                <div className="mt-5 flex items-center justify-center gap-3 bg-gray-50 rounded-full py-2.5 px-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">🇺🇸</div>
                  <span className="text-xs font-bold text-[#00a67e]">→</span>
                  <div className="w-8 h-8 rounded-full bg-[#00a67e] flex items-center justify-center shadow-sm">🇯🇵</div>
                  <span className="text-[10px] text-gray-400 ml-1">{dict.hero.imagesNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FactbaseSection({ dict }: { dict: any }) {
  const factbaseLabels = dict.hero.badge === "Free to use — no credit card required" ? {
    languages: { number: "100+", label: "Supported Languages", description: "Powered by Google Translate. Supports 100+ major languages including English, Japanese, Chinese, Spanish, and more." },
    setup: { number: "1 Line", label: "Setup", description: "Just paste one script tag. No server setup or backend required." },
    free: { number: "50/mo", label: "Free Tier", description: "Free plan includes 50 translations/month. Upgrade to ¥980/month for unlimited." },
  } : {
    languages: { number: "100+", label: "対応言語", description: "Google翻訳を採用。英語、日本語、中国語、スペイン語など100以上の主要言語に対応。" },
    setup: { number: "1行", label: "セットアップ", description: "スクリプトタグ1行をHTMLに貼り付けるだけ。サーバー設定もバックエンドも不要。" },
    free: { number: "月50回", label: "無料枠", description: "無料プランでは月50回まで翻訳可能。それ以上は月額980円で無制限に。" },
  };

  return (
    <section className="py-20 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FactCard number={factbaseLabels.languages.number} label={factbaseLabels.languages.label} description={factbaseLabels.languages.description} />
          <FactCard number={factbaseLabels.setup.number} label={factbaseLabels.setup.label} description={factbaseLabels.setup.description} />
          <FactCard number={factbaseLabels.free.number} label={factbaseLabels.free.label} description={factbaseLabels.free.description} />
        </div>
      </div>
    </section>
  );
}

function FactCard({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
      <div className="text-3xl font-bold text-[#00a67e] mb-1">{number}</div>
      <div className="text-sm font-semibold text-gray-900 mb-2">{label}</div>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function FeaturesSection({ dict }: { dict: any }) {
  const items = dict.features.items;

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {dict.features.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {dict.features.description}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard number="01" title={items.setup.title} description={items.setup.description} />
          <FeatureCard number="02" title={items.languages.title} description={items.languages.description} />
          <FeatureCard number="03" title={items.cost.title} description={items.cost.description} />
          <FeatureCard number="04" title={items.analytics.title} description={items.analytics.description} />
          <FeatureCard number="05" title={items.customizable.title} description={items.customizable.description} />
          <FeatureCard number="06" title={items.speed.title} description={items.speed.description} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#00a67e]/30 hover:shadow-lg hover:shadow-[#00a67e]/5 transition-all duration-300">
      <span className="inline-block text-xs font-bold text-[#00a67e] bg-[#e6f7f1] rounded-full px-2.5 py-1 mb-4">
        {number}
      </span>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function HowItWorksSection({ dict, appUrl }: { dict: any; appUrl: string }) {
  const steps = dict.howItWorks.steps;

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {dict.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {dict.howItWorks.description}
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          <StepCard step="1" title={steps["1"].title} description={steps["1"].description} />
          <StepCard step="2" title={steps["2"].title} description={steps["2"].description} />
          <StepCard step="3" title={steps["3"].title} description={steps["3"].description} />
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <p className="text-sm text-gray-400 mb-3 font-medium">
              {dict.howItWorks.codeLabel}
            </p>
            <code className="block bg-gray-900 text-gray-100 rounded-xl px-6 py-4 text-sm font-mono break-all leading-relaxed">
              &lt;script src=&quot;{appUrl}/api/widget/YOUR_API_KEY.js&quot; async&gt;&lt;/script&gt;
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a67e] text-white flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function PricingSection({ dict, lang }: { dict: any; lang: string }) {
  const p = dict.pricing;

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {p.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {p.description}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCard
            name={p.free.name}
            price={p.free.price}
            currency={p.free.currency}
            period={p.free.period}
            description={p.free.description}
            features={p.free.features}
            cta={p.free.cta}
            highlighted={false}
            lang={lang}
          />
          <PricingCard
            name={p.pro.name}
            price={p.pro.price}
            currency={p.pro.currency}
            period={p.pro.period}
            description={p.pro.description}
            features={p.pro.features}
            cta={p.pro.cta}
            highlighted={true}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  currency,
  period,
  description,
  features,
  cta,
  highlighted,
  lang,
}: {
  name: string;
  price: string;
  currency: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  lang: string;
}) {
  return (
    <div
      className={`rounded-2xl p-8 border-2 ${
        highlighted
          ? "border-[#00a67e] bg-white shadow-xl shadow-[#00a67e]/10 relative"
          : "border-gray-100 bg-white"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00a67e] text-white text-xs font-bold px-4 py-1 rounded-full">
          {name === "Pro" || name === "プロ" ? "おすすめ" : "Recommended"}
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="text-sm text-gray-400">{currency === "JPY" ? "¥" : "$"}</span>
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          <span className="text-sm text-gray-400">{period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
            <Check className="h-4 w-4 text-[#00a67e] mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={`/${lang}/signup`}
        className={`block text-center text-sm font-semibold py-3 rounded-full transition-all ${
          highlighted
            ? "bg-[#00a67e] text-white hover:bg-[#008f6d] shadow-lg shadow-[#00a67e]/25"
            : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        {cta}
      </a>
    </div>
  );
}

function CtaSection({ dict, lang }: { dict: any; lang: string }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#00a67e] to-[#008f6d] rounded-3xl px-8 py-16 md:px-16 md:py-20 shadow-2xl shadow-[#00a67e]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {dict.cta.title}
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            {dict.cta.description}
          </p>
          <a
            href={`/${lang}/signup`}
            className="mt-8 inline-flex items-center justify-center text-base font-semibold text-[#00a67e] bg-white hover:bg-gray-50 transition-all px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {dict.cta.button}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ dict, lang }: { dict: any; lang: string }) {
  return (
    <footer className="border-t border-gray-100 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#00a67e] flex items-center justify-center">
            <Globe className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{dict.nav.logo}</span>
        </div>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {dict.footer.copyright}
        </p>
        <div className="flex items-center gap-6">
          <Link
            href={`/${lang}/login`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {dict.footer.login}
          </Link>
          <Link
            href={`/${lang}/signup`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {dict.footer.signup}
          </Link>
        </div>
      </div>
    </footer>
  );
}
