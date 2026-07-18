"use client";

import { useRouter } from "next/navigation";
import { locales } from "@/lib/i18n/dictionaries";

export function LocaleToggle({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const nextLocale = locales.find((l) => l !== currentLocale)!;

  const handleToggle = () => {
    document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={handleToggle}
      className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
    >
      {nextLocale === "ja" ? "日本語" : "English"}
    </button>
  );
}
