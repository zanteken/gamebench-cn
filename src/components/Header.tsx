"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { Locale, Dictionary } from "@/i18n/dictionaries";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NAV_ITEMS = [
    { href: `/${locale}`, label: dict.nav.games, exact: true },
    { href: `/${locale}/fps-calculator`, label: dict.nav.fpsCalc },
    { href: `/${locale}/gpu`, label: dict.nav.gpuTier },
    { href: `/${locale}/cpu`, label: dict.nav.cpuTier },
    { href: `/${locale}/download`, label: dict.nav.download },
  ];

  // Language options
  const languages = [
    { code: "zh" as Locale, label: "中文", flag: "🇨🇳" },
    { code: "en" as Locale, label: "EN", flag: "🇺🇸" },
  ];

  // Function to switch language
  const switchLanguage = (newLocale: Locale) => {
    // Save preference in cookie
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    // Navigate to the same path with new locale
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

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

          {/* Language Dropdown */}
          <div className="ml-2 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#2a3548] bg-[#111827] px-2.5 py-1.5 text-sm text-slate-300 transition hover:border-blue-500/40 hover:text-white"
            >
              <span className="text-xs font-semibold">{locale === "zh" ? "中文" : "EN"}</span>
              <svg
                className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg border border-[#2a3548] bg-[#1a2233] shadow-lg shadow-black/20 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition ${
                      lang.code === locale
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-400 hover:text-white hover:bg-[#252f3e]"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {lang.code === locale && (
                      <span className="ml-auto text-xs text-blue-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
