"use client";

import { useState, useEffect } from "react";
import { getDictionary, hasLocale, defaultLocale, type Dict, type Locale } from "./dictionaries";

function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  const val = match?.[1];
  return val && hasLocale(val) ? val : defaultLocale;
}

export function useDict(): Dict | null {
  const [dict, setDict] = useState<Dict | null>(null);

  useEffect(() => {
    const locale = getLocaleFromCookie();
    getDictionary(locale).then(setDict);
  }, []);

  return dict;
}
