"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, User } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import { useDict } from "@/lib/i18n/use-dict";
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
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

const WIDGET_THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "Auto" },
];

const WIDGET_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function SettingsPage() {
  const dict = useDict();
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

  if (!dict) return null;

  const d = dict.dashboard.settings;

  if (loading) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        {dict.common.loading}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        {d.profileNotFound}
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
            <User className="h-4 w-4 text-[#00a67e]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{d.profile}</h2>
            <p className="text-xs text-gray-400">{d.profileDesc}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.email}
            </label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full h-10 px-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.displayName}
            </label>
            <input
              value={profile.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.nativeLanguage}
            </label>
            <select
              value={profile.native_language}
              onChange={(e) =>
                setProfile({ ...profile, native_language: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900">{d.widgetSettings}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {d.widgetSettingsDesc}
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.position}
            </label>
            <select
              value={profile.widget_position}
              onChange={(e) =>
                setProfile({ ...profile, widget_position: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
            >
              {WIDGET_POSITIONS.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.theme}
            </label>
            <select
              value={profile.widget_theme}
              onChange={(e) =>
                setProfile({ ...profile, widget_theme: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
            >
              {WIDGET_THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              {d.size}
            </label>
            <select
              value={profile.widget_size}
              onChange={(e) =>
                setProfile({ ...profile, widget_size: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00a67e]/20 focus:border-[#00a67e]"
            >
              {WIDGET_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#00a67e] hover:bg-[#008f6d] transition-all px-6 py-2.5 rounded-full disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? d.saving : d.save}
        </button>
        {saved && (
          <span className="text-sm font-medium text-[#00a67e]">
            {d.saved}
          </span>
        )}
      </div>
    </div>
  );
}
