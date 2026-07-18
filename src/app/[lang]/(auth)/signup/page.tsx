"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Globe } from "lucide-react";
import { getDictionary, type Dict } from "@/lib/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n/locales";

export default function SignUpPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [dict, setDict] = useState<Dict | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (hasLocale(lang)) {
      getDictionary(lang).then(setDict);
    }
  }, [lang]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (!dict) return null;

  const d = dict.auth.signup;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href={`/${lang}`} className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-xl bg-[#00a67e] flex items-center justify-center">
                <Globe className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                LSwitch
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{d.title}</h1>
            <p className="mt-1.5 text-sm text-gray-500">{d.subtitle}</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                {d.name}
              </label>
              <input
                id="displayName"
                type="text"
                placeholder={d.namePlaceholder}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {d.email}
              </label>
              <input
                id="email"
                type="email"
                placeholder={d.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {d.password}
              </label>
              <input
                id="password"
                type="password"
                placeholder={d.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#00a67e] hover:bg-[#008f6d] text-white font-semibold text-sm rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? d.creating : d.button}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {d.hasAccount}{" "}
            <Link
              href={`/${lang}/login`}
              className="font-semibold text-[#00a67e] hover:text-[#008f6d] transition-colors"
            >
              {d.login}
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#e6f7f1] to-[#f0faf6]">
        <div className="max-w-md px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#00a67e]/10 flex items-center justify-center mx-auto mb-6">
            <Globe className="h-10 w-10 text-[#00a67e]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {d.illustrationTitle}
          </h2>
          <p className="text-gray-500 leading-relaxed">
            {d.illustrationDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
