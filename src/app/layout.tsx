import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Language Switcher — One Line to Go Multilingual",
  description:
    "Add multi-language support to your website with a single script tag. Let visitors browse in their native language.",
  icons: { icon: "/globe.svg", apple: "/globe.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-figtree), system-ui, sans-serif" }}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y2HM6DS5P5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y2HM6DS5P5');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
