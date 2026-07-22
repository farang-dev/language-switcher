"use client";

import Link from "next/link";
import { locales, type Dict } from "@/lib/i18n/dictionaries";

export function Header({
  dict,
  lang,
  activePage,
}: {
  dict: Dict;
  lang: string;
  activePage?: "home" | "docs";
}) {
  const otherLocale = locales.find((l) => l !== lang)!;

  return (
    <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center">
          <span className="font-bold text-lg sm:text-xl tracking-tight text-black">
            {dict.nav.logo}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-0.5">
          <Link
            href={`/${lang}#features`}
            className="px-3 py-1.5 text-sm font-medium text-black transition-colors rounded-lg hover:bg-white/30"
          >
            {dict.nav.features}
          </Link>
          <Link
            href={`/${lang}#pricing`}
            className="px-3 py-1.5 text-sm font-medium text-black transition-colors rounded-lg hover:bg-white/30"
          >
            {dict.nav.pricing}
          </Link>
          <Link
            href={`/${lang}/docs`}
            className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-lg ${
              activePage === "docs"
                ? "bg-[#e6f7f1] text-[#00a67e]"
                : "text-black hover:bg-white/30"
            }`}
          >
            {dict.nav.docs}
          </Link>
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href={`/${lang}/login`}
            className="hidden sm:inline-flex text-sm font-medium text-black transition-colors px-3 py-2"
          >
            {dict.nav.login}
          </Link>
          <a
            href={`/${otherLocale}${activePage === "docs" ? "/docs" : ""}`}
            className="text-sm font-medium text-black transition-colors px-1.5 sm:px-2 py-1"
          >
            {otherLocale === "ja" ? "日本語" : "English"}
          </a>
          <Link
            href={`/${lang}/signup`}
            className="text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-colors px-4 sm:px-5 py-2 sm:py-2.5 rounded-full"
          >
            {dict.nav.getStarted}
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 text-black hover:text-black/70"
            onClick={() => {
              const nav = document.getElementById("mobile-nav");
              nav?.classList.toggle("hidden");
            }}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div id="mobile-nav" className="hidden md:hidden border-t border-black/10 bg-white/30 backdrop-blur-xl">
        <div className="px-4 py-3 space-y-1">
          <Link
            href={`/${lang}#features`}
            className="block px-3 py-2 text-sm font-medium text-black hover:bg-white/30 rounded-lg"
          >
            {dict.nav.features}
          </Link>
          <Link
            href={`/${lang}#pricing`}
            className="block px-3 py-2 text-sm font-medium text-black hover:bg-white/30 rounded-lg"
          >
            {dict.nav.pricing}
          </Link>
          <Link
            href={`/${lang}/docs`}
            className="block px-3 py-2 text-sm font-medium text-black hover:bg-white/30 rounded-lg"
          >
            {dict.nav.docs}
          </Link>
          <Link
            href={`/${lang}/login`}
            className="block px-3 py-2 text-sm font-medium text-black hover:bg-white/30 rounded-lg sm:hidden"
          >
            {dict.nav.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
