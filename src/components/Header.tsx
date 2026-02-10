"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, Dictionary } from "@/i18n/dictionaries";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();

  // Build the same path but with opposite locale
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const NAV_ITEMS = [
    { href: `/${locale}`, label: dict.nav.games, exact: true },
    { href: `/${locale}/fps-calculator`, label: dict.nav.fpsCalc },
    { href: `/${locale}/gpu`, label: dict.nav.gpuTier },
    { href: `/${locale}/cpu`, label: dict.nav.cpuTier },
    { href: `/${locale}/download`, label: dict.nav.download },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#0a0e17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="text-lg font-bold text-white tracking-tight">
          Game<span className="text-blue-500">Bencher</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden sm:block rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-[#1a2233]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Language Switcher */}
          <Link
            href={switchPath}
            onClick={() => {
              // Save preference in cookie
              document.cookie = `locale=${otherLocale};path=/;max-age=31536000`;
            }}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-[#2a3548] bg-[#111827] px-3 py-1.5 text-sm text-slate-300 transition hover:border-blue-500/40 hover:text-white"
          >
            <span className="text-base">{locale === "zh" ? "🌐" : "🌐"}</span>
            <span>{locale === "zh" ? "EN" : "中文"}</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex border-t border-[#1e293b]">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-2 text-center text-xs transition ${
                active ? "text-blue-400 font-medium" : "text-slate-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
