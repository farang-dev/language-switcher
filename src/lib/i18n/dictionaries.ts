import { type Locale } from "./locales";

export type { Locale } from "./locales";
export { locales, defaultLocale, hasLocale } from "./locales";

const dictionaries = {
  ja: () => import("./ja.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
} as const;

export type Dict = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export const getDictionary = async (locale: Locale): Promise<Dict> =>
  dictionaries[locale]();
