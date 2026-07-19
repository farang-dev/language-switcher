import { hasLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "ja") {
    return { title: "LSwitch | ウェブ翻訳", description: "スクリプト1行でサイトを多言語対応。訪問者が母国語で閲覧できます。" };
  }
  return { title: "Language Switcher — One Line to Go Multilingual", description: "Add multi-language support to your website with a single script tag." };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}"`,
        }}
      />
      {children}
    </>
  );
}
