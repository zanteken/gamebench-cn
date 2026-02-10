import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, getDictionary } from "@/i18n/dictionaries";
import Header from "@/components/Header";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return {
    title: {
      default: `${dict.siteName} - ${dict.siteSlogan}`,
      template: `%s | ${dict.siteName}`,
    },
    description: dict.siteDescription,
    metadataBase: new URL("https://gamebencher.com"),
    alternates: {
      canonical: `https://gamebencher.com/${locale}`,
      languages: {
        zh: "https://gamebencher.com/zh",
        en: "https://gamebencher.com/en",
      },
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-[#0a0e17] text-slate-100 antialiased">
        <Header locale={locale} dict={dict} />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-[#1e293b] py-6 text-center text-xs text-slate-600">
          {dict.footer.tagline}
        </footer>
      </body>
    </html>
  );
}
