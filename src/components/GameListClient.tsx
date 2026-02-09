"use client";

import { useState, useMemo } from "react";
import { GameCardData } from "@/lib/types";
import GameCard from "./GameCard";

const PAGE_SIZE = 40;

interface Props {
  games: GameCardData[];
  genres: string[];
}

export default function GameListClient({ games, genres }: Props) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredGames = useMemo(() => {
    let result = games;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }
    if (selectedGenre) {
      result = result.filter((g) => g.genres.includes(selectedGenre));
    }
    return result;
  }, [games, search, selectedGenre]);

  // Reset pagination when filters change
  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  const handleFilterChange = (genre: string | null) => {
    setSelectedGenre(genre);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜索游戏名称..."
            className="w-full rounded-lg border border-[#1e293b] bg-[#111827] py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-600"
          />
        </div>

        {/* Genre filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange(null)}
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
                handleFilterChange(genre === selectedGenre ? null : genre)
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
      {displayedGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedGames.map((game) => (
              <GameCard key={game.appId} game={game} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-lg border border-[#1e293b] bg-[#1a2233] px-8 py-3 text-sm font-medium text-slate-300 transition hover:border-brand-600/50 hover:bg-[#1f2b3f] hover:text-white"
              >
                加载更多（还有 {filteredGames.length - visibleCount} 款）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <p className="text-lg">没有找到匹配的游戏</p>
          <p className="mt-1 text-sm">试试换个关键词？</p>
        </div>
      )}
    </>
  );
}
