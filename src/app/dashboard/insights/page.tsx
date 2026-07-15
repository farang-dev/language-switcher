"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Users } from "lucide-react";
import { LANGUAGES_MAP } from "@/lib/languages";
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

  // 統計を計算
  const totalTranslations = logs.length;
  const uniqueVisitors = new Set(logs.map((l) => l.visitor_id)).size;

  // 言語別の集計
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

  // 日別の集計
  const dailyStats = logs.reduce(
    (acc, log) => {
      const date = new Date(log.translated_at).toLocaleDateString("ja-JP");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const dailyChartData = Object.entries(dailyStats)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .reverse();

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (sites.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">インサイト</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              まだサイトが登録されていません。先にサイトを登録してください。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">インサイト</h1>
        <p className="text-muted-foreground mt-1">翻訳使用量の分析</p>
      </div>

      {/* サイト選択 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">サイト:</label>
        <select
          value={selectedSiteId}
          onChange={(e) => setSelectedSiteId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.site_name || site.domain}
            </option>
          ))}
        </select>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総翻訳数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTranslations.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ユニークビジター</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueVisitors.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">対応言語数</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(languageStats).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チャート */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>人気言語ランキング</CardTitle>
          </CardHeader>
          <CardContent>
            {languageChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={languageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                データがありません
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>日別翻訳数</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                データがありません
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近の翻訳ログ */}
      <Card>
        <CardHeader>
          <CardTitle>最近の翻訳ログ</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>元言語</TableHead>
                  <TableHead>翻訳先</TableHead>
                  <TableHead>ページ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 10).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.translated_at).toLocaleString("ja-JP")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {LANGUAGES_MAP[log.source_language]?.flag}{" "}
                        {LANGUAGES_MAP[log.source_language]?.name || log.source_language}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        {LANGUAGES_MAP[log.target_language]?.flag}{" "}
                        {LANGUAGES_MAP[log.target_language]?.name || log.target_language}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {log.page_url || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              まだ翻訳ログがありません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
