"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Globe, Users } from "lucide-react";
import { LANGUAGES_MAP } from "@/lib/languages";
import { useDict } from "@/lib/i18n/use-dict";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Site {
  id: string;
  domain: string;
  site_name: string | null;
}

interface TranslationLog {
  id: string;
  visitor_id: string;
  target_language: string;
  source_language: string;
  translated_at: string;
  page_url: string | null;
}

export default function InsightsPage() {
  const dict = useDict();
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [logs, setLogs] = useState<TranslationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("sites")
          .select("id, domain, site_name")
          .eq("user_id", user.id);

        setSites(data ?? []);
        if (data && data.length > 0) {
          setSelectedSiteId(data[0].id);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  useEffect(() => {
    if (!selectedSiteId) return;

    const fetchLogs = async () => {
      const { data } = await supabase
        .from("translation_logs")
        .select("*")
        .eq("site_id", selectedSiteId)
        .order("translated_at", { ascending: false })
        .limit(100);

      setLogs(data ?? []);
    };

    fetchLogs();
  }, [selectedSiteId, supabase]);

  const totalTranslations = logs.length;
  const uniqueVisitors = new Set(logs.map((l) => l.visitor_id)).size;

  const languageStats = logs.reduce(
    (acc, log) => {
      acc[log.target_language] = (acc[log.target_language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const languageChartData = Object.entries(languageStats)
    .map(([code, count]) => ({
      name: `${LANGUAGES_MAP[code]?.flag || ""} ${LANGUAGES_MAP[code]?.name || code}`,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);

  const dailyStats = logs.reduce(
    (acc, log) => {
      const date = new Date(log.translated_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dailyChartData = Object.entries(dailyStats)
    .map(([date, count]) => ({ date, count }))
    .reverse();

  if (!dict) return null;

  const d = dict.dashboard.insights;

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        {dict.common.loading}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{d.title}</h1>
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-gray-400">{d.noSites}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{d.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{d.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">{d.site}:</label>
        <select
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
          className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.site_name || site.domain}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<BarChart3 className="h-4 w-4 text-[#00a67e]" />}
          label={d.totalTranslations}
          value={totalTranslations.toLocaleString()}
        />
        <StatCard
          icon={<Users className="h-4 w-4 text-[#00a67e]" />}
          label={d.uniqueVisitors}
          value={uniqueVisitors.toLocaleString()}
        />
        <StatCard
          icon={<Globe className="h-4 w-4 text-[#00a67e]" />}
          label={d.languagesUsed}
          value={String(Object.keys(languageStats).length)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            {d.topLanguages}
          </h3>
          {languageChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#00a67e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-400">
              {d.noData}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            {d.dailyTranslations}
          </h3>
          {dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-400">
              {d.noData}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">
          {d.recentTranslations}
        </h3>
        {logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{d.date}</TableHead>
                <TableHead>{d.source}</TableHead>
                <TableHead>{d.target}</TableHead>
                <TableHead>{d.page}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {new Date(log.translated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                      {LANGUAGES_MAP[log.source_language]?.flag}{" "}
                      {LANGUAGES_MAP[log.source_language]?.name ||
                        log.source_language}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center text-xs font-medium text-[#00a67e] bg-[#e6f7f1] rounded-full px-2.5 py-1">
                      {LANGUAGES_MAP[log.target_language]?.flag}{" "}
                      {LANGUAGES_MAP[log.target_language]?.name ||
                        log.target_language}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-gray-400">
                    {log.page_url || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">
            {d.noLogs}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
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
    </div>
  );
}
