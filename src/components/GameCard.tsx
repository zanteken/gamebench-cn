import Link from "next/link";
import { GameCardData } from "@/lib/types";
import { formatPrice, formatRecommendations } from "@/lib/games";
import GameImage from "./GameImage";
import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  game: GameCardData;
  locale?: string;
  dict?: Dictionary;
}

export default function GameCard({ game, locale = "zh", dict }: Props) {
  const hasReqs = game.minReq.cpu || game.minReq.gpu || game.minReq.ram_gb;

  // 根据语言选择显示的名称和 genres
  const displayName = locale === "en" && game.nameEn ? game.nameEn : game.name;
  const displayGenres = locale === "en" && game.genresEn ? game.genresEn : game.genres;

  // Use dict or fallback strings
  const noReqsText = locale === "en" ? "No requirements data" : "暂无配置需求数据";
  const reviewsText = locale === "en" ? "reviews" : "条评测";

  return (
    <Link
      href={`/${locale}/game/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#1a2233] transition-all hover:border-brand-600/50 hover:bg-[#1f2b3f] hover:shadow-lg hover:shadow-brand-600/5"
    >
      {/* Game Image */}
      <div className="relative aspect-[460/215] w-full overflow-hidden bg-[#111827]">
        <GameImage
          src={game.headerImage}
          alt={displayName}
          appId={game.appId}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Price badge */}
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {formatPrice(game.price, game.isFree, locale)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-semibold text-white line-clamp-1 group-hover:text-brand-400">
          {displayName}
        </h3>

        {/* Genres */}
        <div className="mb-3 flex flex-wrap gap-1">
          {displayGenres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="rounded bg-[#111827] px-1.5 py-0.5 text-[10px] text-slate-400"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Minimum requirements summary */}
        {hasReqs ? (
          <div className="mt-auto space-y-1 border-t border-[#1e293b] pt-3 text-[11px] text-slate-400">
            {game.minReq.cpu && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">CPU</span>
                <span className="truncate">{game.minReq.cpu}</span>
              </div>
            )}
            {game.minReq.gpu && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">GPU</span>
                <span className="truncate">{game.minReq.gpu}</span>
              </div>
            )}
            {game.minReq.ram_gb && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">RAM</span>
                <span>{game.minReq.ram_gb} GB</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-auto border-t border-[#1e293b] pt-3 text-[11px] text-slate-500">
            {noReqsText}
          </div>
        )}

        {/* Reviews count */}
        {game.recommendations > 0 && (
          <div className="mt-2 text-[10px] text-slate-500">
            {formatRecommendations(game.recommendations, locale)} {reviewsText}
          </div>
        )}
      </div>
    </Link>
  );
}
