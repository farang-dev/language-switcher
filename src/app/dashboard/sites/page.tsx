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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, ExternalLink } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import type { User } from "@supabase/supabase-js";

interface Site {
  id: string;
  domain: string;
  site_name: string | null;
  api_key: string;
  allowed_languages: string[];
  default_target_language: string;
  is_active: boolean;
  created_at: string;
}

export default function SitesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newSiteName, setNewSiteName] = useState("");
  const [newDefaultLang, setNewDefaultLang] = useState("en");
  const [newAllowedLangs, setNewAllowedLangs] = useState<string[]>(["en", "ja", "es", "fr", "de", "zh", "ko", "pt", "it", "ru"]);
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [editingAllowedLangs, setEditingAllowedLangs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("sites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setSites(data ?? []);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    const { data, error } = await supabase
      .from("sites")
      .insert({
        user_id: user.id,
        domain: newDomain,
        site_name: newSiteName || null,
        default_target_language: newDefaultLang,
        allowed_languages: newAllowedLangs,
      })
      .select()
      .single();

    if (!error && data) {
      setSites([data, ...sites]);
      setDialogOpen(false);
      setNewDomain("");
      setNewSiteName("");
      setNewDefaultLang("en");
      setNewAllowedLangs(["en", "ja", "es", "fr", "de", "zh", "ko", "pt", "it", "ru"]);
    }
    setCreating(false);
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("このサイトを削除しますか？")) return;

    const { error } = await supabase.from("sites").delete().eq("id", siteId);

    if (!error) {
      setSites(sites.filter((s) => s.id !== siteId));
    }
  };

  const handleUpdateAllowedLangs = async (siteId: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("sites")
      .update({ allowed_languages: editingAllowedLangs, updated_at: new Date().toISOString() })
      .eq("id", siteId);

    if (!error) {
      setSites(sites.map((s) => (s.id === siteId ? { ...s, allowed_languages: editingAllowedLangs } : s)));
      setEditingSiteId(null);
    }
    setSaving(false);
  };

  const toggleAllowedLang = (langCode: string, isEdit: boolean) => {
    if (isEdit) {
      setEditingAllowedLangs((prev) =>
        prev.includes(langCode) ? prev.filter((l) => l !== langCode) : [...prev, langCode]
      );
    } else {
      setNewAllowedLangs((prev) =>
        prev.includes(langCode) ? prev.filter((l) => l !== langCode) : [...prev, langCode]
      );
    }
  };

  const copyApiKey = (apiKey: string) => {
    const widgetUrl = `${window.location.origin}/api/widget/${apiKey}.js`;
    navigator.clipboard.writeText(
      `<script src="${widgetUrl}" async></script>`
    );
    setCopiedKeyId(apiKey);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">サイト管理</h1>
          <p className="text-muted-foreground mt-1">
            登録されたサイトの一覧と設定
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            サイトを追加
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateSite}>
              <DialogHeader>
                <DialogTitle>新しいサイトを追加</DialogTitle>
                <DialogDescription>
                  サイトのドメインを入力してください。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">ドメイン</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteName">サイト名（任意）</Label>
                  <Input
                    id="siteName"
                    placeholder="My Website"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLang">デフォルトターゲット言語</Label>
                  <select
                    id="defaultLang"
                    value={newDefaultLang}
                    onChange={(e) => setNewDefaultLang(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>対応言語</Label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang.code}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${
                          newAllowedLangs.includes(lang.code)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-input hover:bg-muted"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={newAllowedLangs.includes(lang.code)}
                          onChange={() => toggleAllowedLang(lang.code, false)}
                        />
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </label>
                    ))}
                  </div>
                  {newAllowedLangs.length === 0 && (
                    <p className="text-sm text-destructive">少なくとも1つの言語を選択してください</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creating || newAllowedLangs.length === 0}>
                  {creating ? "作成中..." : "作成"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              まだサイトが登録されていません。
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              最初のサイトを追加
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {site.site_name || site.domain}
                      <Badge variant={site.is_active ? "default" : "secondary"}>
                        {site.is_active ? "有効" : "無効"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <ExternalLink className="h-3 w-3" />
                      {site.domain}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyApiKey(site.api_key)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedKeyId === site.api_key ? "コピー済み!" : "コードをコピー"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSite(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground mb-1">{"<!-- Widgetコード -->"}</p>
                  <p className="break-all whitespace-pre-wrap">
{`<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/widget/${site.api_key}.js" async></script>`}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">対応言語:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSiteId(site.id);
                        setEditingAllowedLangs([...site.allowed_languages]);
                      }}
                    >
                      編集
                    </Button>
                  </div>
                  {editingSiteId === site.id ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => (
                          <label
                            key={lang.code}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-colors ${
                              editingAllowedLangs.includes(lang.code)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-input hover:bg-muted"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={editingAllowedLangs.includes(lang.code)}
                              onChange={() => toggleAllowedLang(lang.code, true)}
                            />
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </label>
                        ))}
                      </div>
                      {editingAllowedLangs.length === 0 && (
                        <p className="text-sm text-destructive">少なくとも1つの言語を選択してください</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateAllowedLangs(site.id)}
                          disabled={saving || editingAllowedLangs.length === 0}
                        >
                          {saving ? "保存中..." : "保存"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSiteId(null)}
                        >
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {site.allowed_languages.map((lang) => {
                        const langInfo = LANGUAGES.find((l) => l.code === lang);
                        return (
                          <Badge key={lang} variant="outline">
                            {langInfo?.flag} {langInfo?.name || lang}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
