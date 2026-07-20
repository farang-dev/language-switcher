import Link from "next/link";
import { Globe } from "lucide-react";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";

export default async function DocsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const d = dict.docs;

  return (
    <div className="min-h-screen flex flex-col">
      <Header dict={dict} lang={lang} activePage="docs" />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#e6f7f1]/60 to-white py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block text-xs font-bold text-[#00a67e] bg-[#e6f7f1] rounded-full px-3 py-1 mb-4">
              {d.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {d.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {d.description}
            </p>
          </div>
        </section>

        {/* What is LSwitch */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {d.whatIs.title}
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-4">
                {d.whatIs.intro}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {d.whatIs.points.map((point: { title: string; description: string }, i: number) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#e6f7f1] text-[#00a67e] flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">{point.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {d.quickStart.title}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-10">
              {d.quickStart.description}
            </p>

            <div className="space-y-6">
              {d.quickStart.steps.map((step: { title: string; description: string; detail?: string }, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00a67e] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm sm:text-base text-gray-500">{step.description}</p>
                    {step.detail && (
                      <code className="mt-3 block bg-gray-900 text-gray-100 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono break-all leading-relaxed">
                        {step.detail}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {d.features.title}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-10">
              {d.features.description}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {d.features.items.map((feature: { title: string; description: string }, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#00a67e]/30 hover:shadow-md transition-all">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Widget Customization */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {d.customization.title}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-8">
              {d.customization.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {d.customization.items.map((item: { label: string; description: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                  <div className="w-6 h-6 rounded-full bg-[#e6f7f1] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#00a67e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
              {d.faq.title}
            </h2>
            <div className="space-y-4">
              {d.faq.items.map((item: { question: string; answer: string }, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-gradient-to-br from-[#00a67e] to-[#008f6d] rounded-3xl px-6 py-12 sm:px-12 sm:py-16 shadow-2xl shadow-[#00a67e]/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {d.cta.title}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-white/80 max-w-xl mx-auto">
                {d.cta.description}
              </p>
              <Link
                href={`/${lang}/signup`}
                className="mt-6 inline-flex items-center justify-center text-sm sm:text-base font-semibold text-[#00a67e] bg-white hover:bg-gray-50 transition-all px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {d.cta.button}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
    </div>
  );
}
