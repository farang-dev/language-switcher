import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Globe, Code, BarChart3 } from "lucide-react";
import { getDictionary, hasLocale, defaultLocale } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sites } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", user!.id);

  const siteCount = sites?.length ?? 0;

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const locale = localeCookie && hasLocale(localeCookie) ? localeCookie : defaultLocale;
  const dict = await getDictionary(locale);
  const d = dict.dashboard.overview;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {d.title}{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {d.subtitle}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<Globe className="h-4 w-4 text-[#00a67e]" />}
          label={d.registeredSites}
          value={String(siteCount)}
          href="/dashboard/sites"
          linkText={d.manageSites}
        />
        <StatCard
          icon={<Code className="h-4 w-4 text-[#00a67e]" />}
          label={d.widgetStatus}
          value={siteCount > 0 ? d.active : d.notSetUp}
          href="/dashboard/sites"
          linkText={d.getCode}
        />
        <StatCard
          icon={<BarChart3 className="h-4 w-4 text-[#00a67e]" />}
          label={d.translations}
          value="--"
          href="/dashboard/insights"
          linkText={d.viewInsights}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{d.quickStart}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Step number="1" title={d.step1} description={d.step1Desc} />
          <Step number="2" title={d.step2} description={d.step2Desc} />
          <Step number="3" title={d.step3} description={d.step3Desc} />
        </div>
        <div className="mt-6">
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center justify-center text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-5 py-2.5 rounded-full"
          >
            {d.registerFirstSite}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  linkText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <Link
        href={href}
        className="inline-block mt-2 text-sm font-medium text-[#00a67e] hover:text-[#008f6d] transition-colors"
      >
        {linkText} →
      </Link>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e6f7f1] text-[#00a67e] flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
