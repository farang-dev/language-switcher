import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n/dictionaries";

function isPublicRoute(pathname: string): boolean {
  const localePattern = locales.length > 0
    ? `/(${locales.join("|")})`
    : "";
  const publicPaths = [
    "/login",
    "/signup",
    "/test",
    "/api/widget",
  ];
  const localizedPublicPaths = locales.flatMap((locale) =>
    publicPaths.map((p) => `/${locale}${p}`)
  );
  const allPublic = [...publicPaths, ...localizedPublicPaths];
  return allPublic.some((r) => pathname.startsWith(r));
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
