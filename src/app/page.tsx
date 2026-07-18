import Link from "next/link";
import { Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a67e] flex items-center justify-center">
              <Globe className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">
              LSwitch
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-colors px-5 py-2.5 rounded-full"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f7f1] via-white to-[#f0faf6]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00a67e]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#00a67e] animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Free to use — no credit card required
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Go multilingual
              <br />
              <span className="text-[#00a67e]">with one line</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Add a language switcher to your website instantly. Your visitors
              translate your content into their native language — right in the
              browser.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-base font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-8 py-3.5 rounded-full shadow-lg shadow-[#00a67e]/25 hover:shadow-xl hover:shadow-[#00a67e]/30 hover:-translate-y-0.5"
              >
                Start for Free
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center text-base font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 transition-all px-8 py-3.5 rounded-full"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-400 max-w-md mx-auto">
                    yourwebsite.com
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 max-w-lg">
                    <div className="h-8 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-50 rounded w-full" />
                    <div className="h-4 bg-gray-50 rounded w-5/6" />
                    <div className="h-4 bg-gray-50 rounded w-2/3" />
                    <div className="h-10 bg-gray-100 rounded-full w-32 mt-4" />
                  </div>
                  {/* Widget Preview */}
                  <div className="hidden md:flex flex-col items-center gap-1 bg-white rounded-full shadow-lg border border-gray-100 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                      🇺🇸
                    </div>
                    <div className="text-xs font-bold text-[#00a67e]">→</div>
                    <div className="w-9 h-9 rounded-full bg-[#00a67e] flex items-center justify-center text-sm">
                      🇯🇵
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-gray-400 mb-6">
            Trusted by teams building multilingual websites
          </p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            <span className="text-xl font-bold text-gray-900">Acme</span>
            <span className="text-xl font-bold text-gray-900">Globex</span>
            <span className="text-xl font-bold text-gray-900">Hooli</span>
            <span className="text-xl font-bold text-gray-900">Initech</span>
            <span className="text-xl font-bold text-gray-900">Umbrella</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Simple, powerful, and completely free. No server setup, no
              complicated integrations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              number="01"
              title="One-Line Setup"
              description="Paste a single script tag into your HTML. That's it — your site is multilingual."
            />
            <FeatureCard
              number="02"
              title="100+ Languages"
              description="Powered by Google Translate. Support for every major language out of the box."
            />
            <FeatureCard
              number="03"
              title="Zero Server Cost"
              description="Translation runs entirely in the visitor's browser. No API keys, no backend."
            />
            <FeatureCard
              number="04"
              title="Real-Time Analytics"
              description="See which languages your visitors use. Track translations by page and region."
            />
            <FeatureCard
              number="05"
              title="Fully Customizable"
              description="Match your brand with custom colors, position, size, and theme options."
            />
            <FeatureCard
              number="06"
              title="Instant Load"
              description="Async loading means zero impact on your page speed or Core Web Vitals."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three steps to a multilingual website.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            <StepCard
              step="1"
              title="Create your account"
              description="Sign up for free. No credit card needed."
            />
            <StepCard
              step="2"
              title="Register your website"
              description="Add your domain and choose which languages to support."
            />
            <StepCard
              step="3"
              title="Paste the code"
              description="Copy the generated script tag and add it to your site's &lt;head&gt;."
            />
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <p className="text-sm text-gray-400 mb-3 font-medium">
                {"<!-- Add this one line to your site -->"}
              </p>
              <code className="block bg-gray-900 text-gray-100 rounded-xl px-6 py-4 text-sm font-mono break-all leading-relaxed">
                &lt;script src=&quot;https://language-switcher-two.vercel.app/api/widget/e641938bd218dac8178bc938e7bcfddf.js&quot;
                async&gt;&lt;/script&gt;
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#00a67e] to-[#008f6d] rounded-3xl px-8 py-16 md:px-16 md:py-20 shadow-2xl shadow-[#00a67e]/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Make your website global today
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              Join thousands of websites using Language Switcher to reach a
              worldwide audience.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center text-base font-semibold text-[#00a67e] bg-white hover:bg-gray-50 transition-all px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#00a67e] flex items-center justify-center">
              <Globe className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">LSwitch</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Language Switcher. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
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
