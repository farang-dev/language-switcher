"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-xl bg-[#00a67e] flex items-center justify-center">
                <Globe className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                LSwitch
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Log in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#00a67e] hover:bg-[#008f6d] text-white font-semibold text-sm rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#00a67e] hover:text-[#008f6d] transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#e6f7f1] to-[#f0faf6]">
        <div className="max-w-md px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#00a67e]/10 flex items-center justify-center mx-auto mb-6">
            <Globe className="h-10 w-10 text-[#00a67e]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            One line to go global
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Add a language switcher to your website and let visitors browse in
            their native language.
          </p>
        </div>
      </div>
    </div>
  );
}
