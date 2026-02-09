"use client";

import { useState, useMemo } from "react";
import GameCard from "@/components/GameCard";
import { getAllGames, getAllGenres } from "@/lib/games";

const games = getAllGames();
const genres = getAllGenres();

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredGames = useMemo(() => {
    let result = games;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.developers.some((d) => d.toLowerCase().includes(q))
      );
    }
    if (selectedGenre) {
      result = result.filter((g) => g.genres.includes(selectedGenre));
    }
    return result;
  }, [search, selectedGenre]);

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          你的电脑能玩什么游戏？
        </h1>
        <p className="mx-auto max-w-2xl text-slate-400">
          查看 {games.length} 款热门 PC
          游戏的配置需求，预测你的电脑能跑多少帧
        </p>
      </section>

      {/* Stats bar */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "游戏数据库", value: `${games.length}+`, icon: "🎮" },
          { label: "CPU 型号", value: "500+", icon: "⚡" },
          { label: "GPU 型号", value: "300+", icon: "🖥️" },
          { label: "FPS 测试数据", value: "建设中", icon: "📊" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#1a2233] p-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Search + Filters */}
      <section className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索游戏名称..."
            className="w-full rounded-lg border border-[#1e293b] bg-[#111827] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-600"
          />
        </div>

        {/* Genre filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !selectedGenre
                ? "bg-brand-600 text-white"
                : "bg-[#1a2233] text-slate-400 hover:bg-[#1f2b3f] hover:text-white"
            }`}
          >
            全部
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() =>
                setSelectedGenre(genre === selectedGenre ? null : genre)
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                genre === selectedGenre
                  ? "bg-brand-600 text-white"
                  : "bg-[#1a2233] text-slate-400 hover:bg-[#1f2b3f] hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Results count */}
      <div className="mb-4 text-sm text-slate-500">
        {filteredGames.length === games.length
          ? `共 ${games.length} 款游戏`
          : `找到 ${filteredGames.length} 款游戏`}
      </div>

      {/* Game Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game) => (
            <GameCard key={game.appId} game={game} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <p className="text-lg">没有找到匹配的游戏</p>
          <p className="mt-1 text-sm">试试换个关键词？</p>
        </div>
      )}
    </div>
  );
}
