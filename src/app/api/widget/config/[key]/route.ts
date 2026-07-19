import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { key } = await params;
  const apiKey = key.replace(".js", "");

  const { data: site, error } = await supabase
    .from("sites")
    .select(`
      id,
      allowed_languages,
      default_target_language,
      user_profiles!inner (
        widget_position,
        widget_theme,
        widget_size,
        widget_bg_color,
        widget_opacity
      )
    `)
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const profile = site.user_profiles as unknown as {
    widget_position: string;
    widget_theme: string;
    widget_size: string;
    widget_bg_color: string;
    widget_opacity: number;
  };

  return NextResponse.json({
    site_id: site.id,
    allowed_languages: site.allowed_languages,
    default_target_language: site.default_target_language,
    widget_position: profile?.widget_position || "bottom-right",
    widget_theme: profile?.widget_theme || "light",
    widget_size: profile?.widget_size || "large",
    widget_bg_color: profile?.widget_bg_color || "#00a67e",
    widget_opacity: profile?.widget_opacity ?? 1.0,
  });
}
