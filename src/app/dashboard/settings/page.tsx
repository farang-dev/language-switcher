"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, User } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  native_language: string;
  widget_position: string;
  widget_theme: string;
  widget_size: string;
}

const WIDGET_POSITIONS = [
  { value: "bottom-right", label: "右下" },
  { value: "bottom-left", label: "左下" },
  { value: "top-right", label: "右上" },
  { value: "top-left", label: "左上" },
];

const WIDGET_THEMES = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "auto", label: "自動" },
];

const WIDGET_SIZES = [
  { value: "small", label: "小" },
  { value: "medium", label: "中" },
  { value: "large", label: "大" },
];

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({
        display_name: profile.display_name,
        native_language: profile.native_language,
        widget_position: profile.widget_position,
        widget_theme: profile.widget_theme,
        widget_size: profile.widget_size,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        プロファイルが見つかりません
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-muted-foreground mt-1">
          アカウントとWidgetの設定
        </p>
      </div>

      {/* プロファイル設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            プロファイル
          </CardTitle>
          <CardDescription>アカウント情報の設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nativeLanguage">母語</Label>
            <select
              id="nativeLanguage"
              value={profile.native_language}
              onChange={(e) =>
                setProfile({ ...profile, native_language: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Widget設定 */}
      <Card>
        <CardHeader>
          <CardTitle>Widget設定</CardTitle>
          <CardDescription>ウィジェットの見た目の設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widgetPosition">表示位置</Label>
            <select
              id="widgetPosition"
              value={profile.widget_position}
              onChange={(e) =>
                setProfile({ ...profile, widget_position: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {WIDGET_POSITIONS.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="widgetTheme">テーマ</Label>
            <select
              id="widgetTheme"
              value={profile.widget_theme}
              onChange={(e) =>
                setProfile({ ...profile, widget_theme: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {WIDGET_THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="widgetSize">サイズ</Label>
            <select
              id="widgetSize"
              value={profile.widget_size}
              onChange={(e) =>
                setProfile({ ...profile, widget_size: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {WIDGET_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "保存中..." : "保存"}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">保存しました!</span>
        )}
      </div>
    </div>
  );
}
