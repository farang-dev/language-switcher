"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [newAllowedLangs, setNewAllowedLangs] = useState<string[]>([
    "en", "ja", "es", "fr", "de", "zh", "ko", "pt", "it", "ru",
  ]);
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
      setNewAllowedLangs([
        "en", "ja", "es", "fr", "de", "zh", "ko", "pt", "it", "ru",
      ]);
    }
    setCreating(false);
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Delete this site?")) return;

    const { error } = await supabase.from("sites").delete().eq("id", siteId);

    if (!error) {
      setSites(sites.filter((s) => s.id !== siteId));
    }
  };

  const handleUpdateAllowedLangs = async (siteId: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("sites")
      .update({
        allowed_languages: editingAllowedLangs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId);

    if (!error) {
      setSites(
        sites.map((s) =>
          s.id === siteId
            ? { ...s, allowed_languages: editingAllowedLangs }
            : s
        )
      );
      setEditingSiteId(null);
    }
    setSaving(false);
  };

  const toggleAllowedLang = (langCode: string, isEdit: boolean) => {
    if (isEdit) {
      setEditingAllowedLangs((prev) =>
        prev.includes(langCode)
          ? prev.filter((l) => l !== langCode)
          : [...prev, langCode]
      );
    } else {
      setNewAllowedLangs((prev) =>
        prev.includes(langCode)
          ? prev.filter((l) => l !== langCode)
          : [...prev, langCode]
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
    return (
      <div className="text-center py-12 text-sm text-gray-400">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your registered websites and widget configurations.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Site
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateSite}>
              <DialogHeader>
                <DialogTitle>Add a new site</DialogTitle>
                <DialogDescription>
                  Enter your website domain and choose your language settings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="siteName">Site Name (optional)</Label>
                  <Input
                    id="siteName"
                    placeholder="My Website"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="defaultLang">Default Target Language</Label>
                  <select
                    id="defaultLang"
                    value={newDefaultLang}
                    onChange={(e) => setNewDefaultLang(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Supported Languages</Label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <label
                        key={lang.code}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all ${
                          newAllowedLangs.includes(lang.code)
                            ? "bg-[#00a67e] text-white border-[#00a67e]"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
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
                    <p className="text-xs text-red-500">
                      Select at least one language
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={creating || newAllowedLangs.length === 0}
                >
                  {creating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-gray-400 mb-4">
            No sites registered yet.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Your First Site
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-gray-900">
                      {site.site_name || site.domain}
                    </h3>
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                        site.is_active
                          ? "bg-[#e6f7f1] text-[#00a67e]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {site.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
                    <ExternalLink className="h-3 w-3" />
                    {site.domain}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyApiKey(site.api_key)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00a67e] hover:text-[#008f6d] bg-[#e6f7f1] hover:bg-[#d1f0e5] transition-all px-3 py-1.5 rounded-full"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedKeyId === site.api_key ? "Copied!" : "Copy Code"}
                  </button>
                  <button
                    onClick={() => handleDeleteSite(site.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-gray-300 break-all leading-relaxed">
                {`<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/widget/${site.api_key}.js" async></script>`}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Supported Languages
                  </span>
                  <button
                    onClick={() => {
                      setEditingSiteId(site.id);
                      setEditingAllowedLangs([...site.allowed_languages]);
                    }}
                    className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                {editingSiteId === site.id ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <label
                          key={lang.code}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all ${
                            editingAllowedLangs.includes(lang.code)
                              ? "bg-[#00a67e] text-white border-[#00a67e]"
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={editingAllowedLangs.includes(lang.code)}
                            onChange={() =>
                              toggleAllowedLang(lang.code, true)
                            }
                          />
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </label>
                      ))}
                    </div>
                    {editingAllowedLangs.length === 0 && (
                      <p className="text-xs text-red-500">
                        Select at least one language
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateAllowedLangs(site.id)}
                        disabled={saving || editingAllowedLangs.length === 0}
                        className="text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-4 py-1.5 rounded-full disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingSiteId(null)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-100 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {site.allowed_languages.map((lang) => {
                      const langInfo = LANGUAGES.find((l) => l.code === lang);
                      return (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1"
                        >
                          {langInfo?.flag} {langInfo?.name || lang}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
