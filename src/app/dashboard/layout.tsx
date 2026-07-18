import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { LocaleToggle } from "@/components/dashboard/locale-toggle";
import Link from "next/link";
import { Globe } from "lucide-react";
import { getDictionary, defaultLocale, hasLocale } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const locale = localeCookie && hasLocale(localeCookie) ? localeCookie : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#00a67e] flex items-center justify-center">
                <Globe className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-gray-900">
                LSwitch
              </span>
            </Link>
            <DashboardNav dict={dict} />
          </div>
          <div className="flex items-center gap-2">
            <LocaleToggle currentLocale={locale} />
            <UserNav user={user} dict={dict} />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
