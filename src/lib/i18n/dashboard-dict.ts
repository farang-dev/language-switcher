import { getDictionary, defaultLocale, hasLocale, type Dict } from "./dictionaries";

export async function getDashboardDict(cookieLocale?: string): Promise<Dict> {
  const locale = cookieLocale && hasLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return getDictionary(locale);
}

export function getLocaleFromCookie(cookieValue?: string): string {
  return cookieValue && hasLocale(cookieValue) ? cookieValue : defaultLocale;
}
