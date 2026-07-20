"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Check, Zap, BarChart3 } from "lucide-react";
import { useDict } from "@/lib/i18n/use-dict";

interface UserProfile {
  id: string;
  subscription_tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

interface UsageData {
  translation_count: number;
}

const FREE_LIMIT = 50;

export default function BillingPage() {
  const dict = useDict();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [managing, setManaging] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("id, subscription_tier, stripe_customer_id, stripe_subscription_id")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        const now = new Date();
        const { data: usageData } = await supabase
          .from("monthly_usage")
          .select("translation_count")
          .eq("user_id", user.id)
          .eq("year", now.getFullYear())
          .eq("month", now.getMonth() + 1)
          .single();

        setUsage(usageData);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to create checkout session");
    }
    setUpgrading(false);
  };

  const handleManage = async () => {
    setManaging(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to create portal session");
    }
    setManaging(false);
  };

  if (!dict) return null;

  const d = dict.dashboard.billing;
  const isPro = profile?.subscription_tier === "pro";
  const translationCount = usage?.translation_count ?? 0;
  const usagePercent = Math.min((translationCount / FREE_LIMIT) * 100, 100);

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        {dict.common.loading}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{d.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{d.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#e6f7f1] flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-[#00a67e]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{d.currentPlan}</h2>
            <p className="text-xs text-gray-400">{d.currentPlanDesc}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div
            className={`rounded-xl border-2 p-5 transition-all ${
              !isPro
                ? "border-[#00a67e] bg-[#f0faf6]"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">{d.freePlan}</span>
              {!isPro && (
                <span className="text-xs font-semibold text-[#00a67e] bg-[#e6f7f1] px-2 py-0.5 rounded-full">
                  {d.current}
                </span>
              )}
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-gray-900">¥0</span>
              <span className="text-sm text-gray-400">{d.perMonth}</span>
            </div>
            <ul className="space-y-2">
              {d.freeFeatures.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                  <Check className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`rounded-xl border-2 p-5 transition-all ${
              isPro
                ? "border-[#00a67e] bg-[#f0faf6]"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">{d.proPlan}</span>
              {isPro && (
                <span className="text-xs font-semibold text-[#00a67e] bg-[#e6f7f1] px-2 py-0.5 rounded-full">
                  {d.current}
                </span>
              )}
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-gray-900">¥980</span>
              <span className="text-sm text-gray-400">{d.perMonth}</span>
            </div>
            <ul className="space-y-2">
              {d.proFeatures.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                  <Check className="h-4 w-4 text-[#00a67e] mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          {!isPro ? (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-6 py-2.5 rounded-full disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              {upgrading ? d.redirecting : d.upgradeToPro}
            </button>
          ) : (
            <button
              onClick={handleManage}
              disabled={managing}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all px-6 py-2.5 rounded-full disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              {managing ? d.redirecting : d.manageSubscription}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#e6f7f1] flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-[#00a67e]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{d.usageTitle}</h2>
            <p className="text-xs text-gray-400">{d.usageDesc}</p>
          </div>
        </div>

        {isPro ? (
          <div className="flex items-center gap-3 p-4 bg-[#f0faf6] rounded-xl">
            <Zap className="h-5 w-5 text-[#00a67e]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{d.unlimitedTranslations}</p>
              <p className="text-xs text-gray-500">{d.proUsageHint}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{d.thisMonth}</span>
              <span className="font-semibold text-gray-900">
                {translationCount} / {FREE_LIMIT}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  backgroundColor:
                    usagePercent >= 90
                      ? "#ef4444"
                      : usagePercent >= 70
                        ? "#f59e0b"
                        : "#00a67e",
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {usagePercent >= 90
                ? d.usageWarning
                : d.usageHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
