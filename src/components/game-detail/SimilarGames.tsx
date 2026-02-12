"use client";

import Link from "next/link";
import { Dictionary } from "@/i18n/dictionaries";

interface SimilarGame {
  slug: string;
  name: string;
  nameEn?: string;
  icon: string;
  tag?: string;
}

interface Props {
  locale: string;
  currentGameSlug: string;
  genres?: string[];
  dict: Dictionary;
}

export default function SimilarGames({ locale, currentGameSlug, genres = [], dict }: Props) {
  // This would normally come from an API or data source
  // For now, using placeholder similar games
  const similarGames: SimilarGame[] = [
    { slug: "cyberpunk-2077", name: "赛博朋克2077", nameEn: "Cyberpunk 2077", icon: "🌃", tag: "Cyberpunk 2077" },
    { slug: "baldurs-gate-3", name: "博德之门3", nameEn: "Baldur's Gate 3", icon: "🐉", tag: "CRPG" },
    { slug: "re4-remake", name: "生化危机4重制版", nameEn: "RE4 Remake", icon: "🧟", tag: "Horror" },
    { slug: "gta-vi", name: "GTA 6", nameEn: "GTA VI", icon: "🚗", tag: "Open World" },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {/* Section Label */}
      <div className="mb-6 text-center">
        <span className="text-xs tracking-widest uppercase text-blue-400/70">More · 更多</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">查看其他游戏配置</h2>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {similarGames.map((game) => {
          const displayName = locale === "en" && game.nameEn ? game.nameEn : game.name;
          return (
            <Link
              key={game.slug}
              href={`/${locale}/game/${game.slug}`}
              className="bg-[#16202d] border border-[#1e293b] rounded-lg px-4 py-5 text-center transition-all hover:border-blue-500/50 hover:-translate-y-1"
            >
              <div className="text-3xl mb-2.5">{game.icon}</div>
              <div className="text-sm text-slate-300 font-medium mb-1">{displayName}</div>
              {game.tag && (
                <div className="text-xs text-slate-500">{game.tag}</div>
              )}
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#16202d] border border-[#1e293b] rounded-lg text-slate-400 text-sm hover:border-blue-500/50 hover:text-slate-200 transition-all"
        >
          {dict.game.moreGames} →
        </Link>
      </div>
    </section>
  );
}
