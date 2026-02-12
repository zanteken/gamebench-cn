"use client";

import Link from "next/link";
import { Dictionary } from "@/i18n/dictionaries";

interface Props {
  locale: string;
  gameName: string;
  gameNameEn?: string;
  headerImage?: string;
  developers?: string[];
  releaseDate?: string;
  genres?: string[];
  dict: Dictionary;
}

export default function GameHero({
  locale,
  gameName,
  gameNameEn,
  headerImage,
  developers,
  releaseDate,
  genres,
  dict,
}: Props) {
  const displayName = locale === "en" && gameNameEn ? gameNameEn : gameName;

  return (
    <header className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden mt-14">
      {/* Background with gradient and noise */}
      <div className="absolute inset-0 bg-[#0a0e17]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(26,159,255,0.06)_0%,transparent_60%),radial-gradient(ellipse_at_70%_30%,rgba(26,159,255,0.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Breadcrumb */}
      <nav className="relative z-10 px-4 md:px-8 pt-4 max-w-4xl mx-auto">
        <Link href={`/${locale}`} className="text-xs text-slate-500 hover:text-blue-400 transition">
          {locale === "zh" ? "首页" : "Home"}
        </Link>
        <span className="mx-1.5 text-slate-700">/</span>
        <span className="text-blue-400/70">{displayName}</span>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        {headerImage && (
          <div className="mb-6 mx-auto max-w-3xl rounded-xl overflow-hidden border border-[#1e293b] bg-[#0f1825]">
            <img
              src={headerImage}
              alt={displayName}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Tag */}
        <div className="text-xs tracking-widest uppercase text-blue-400/70 mb-4">
          PC {dict.game.configTitle} · System Requirements
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          {displayName.toUpperCase()}
        </h1>

        {/* Subtitle for Chinese name */}
        {locale === "zh" && gameNameEn && (
          <div className="text-lg md:text-xl text-blue-400/70 tracking-widest uppercase mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
            {gameNameEn}
          </div>
        )}

        {/* Description */}
        <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base font-light mb-8 max-w-xl">
          {dict.game.heroDesc}
        </p>

        {/* CTA Button */}
        <Link
          href={`/${locale}/fps-calculator?game=${encodeURIComponent(gameName)}`}
          className="inline-flex items-center gap-2.5 px-9 py-3.5 bg-gradient-to-br from-cyan-400 to-blue-500 text-[#0a0e17] border-none rounded font-bold text-sm tracking-wider uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
        >
          {dict.game.startCheck}
        </Link>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-xs tracking-widest">
        向下滚动 ↓
      </div>
    </header>
  );
}
