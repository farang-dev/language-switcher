import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Code, BarChart3 } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          おかえりなさい、{user?.user_metadata?.display_name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          Language Switcher Web ダッシュボード
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">登録サイト数</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/sites" className="text-primary hover:underline">
                サイトを管理する →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Widgetコード</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {siteCount > 0 ? "設定済み" : "未設定"}
            </div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/sites" className="text-primary hover:underline">
                コードを取得する →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">翻訳インサイト</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/insights" className="text-primary hover:underline">
                インサイトを見る →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>クイックスタート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. サイトを登録</h3>
            <p className="text-sm text-muted-foreground">
              まず、你的なウェブサイトを登録してください。
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">2. Widgetコードをコピー</h3>
            <p className="text-sm text-muted-foreground">
              登録後、あなたのサイト用のWidgetコードが生成されます。
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">3. サイトに貼り付け</h3>
            <p className="text-sm text-muted-foreground">
              HTMLの{"<head>"}タグ内にコードを貼り付けるだけです。
            </p>
          </div>
          <Link href="/dashboard/sites">
            <Button>サイトを登録する</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
