import Link from "next/link";
import Image from "next/image";
import { Game, formatPrice, formatRecommendations } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  const minReq = game.requirements.minimum;
  const hasReqs = minReq.cpu || minReq.gpu || minReq.ram_gb;

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#1a2233] transition-all hover:border-brand-600/50 hover:bg-[#1f2b3f] hover:shadow-lg hover:shadow-brand-600/5"
    >
      {/* Game Image */}
      <div className="relative aspect-[460/215] w-full overflow-hidden bg-[#111827]">
        {game.headerImage ? (
          <Image
            src={game.headerImage}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            暂无封面
          </div>
        )}

        {/* Price badge */}
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {formatPrice(game.price, game.isFree)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-semibold text-white line-clamp-1 group-hover:text-brand-400">
          {game.name}
        </h3>

        {/* Genres */}
        <div className="mb-3 flex flex-wrap gap-1">
          {game.genres.slice(0, 3).map((genre) => (
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
            {minReq.cpu && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">CPU</span>
                <span className="truncate">{minReq.cpu}</span>
              </div>
            )}
            {minReq.gpu && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">GPU</span>
                <span className="truncate">{minReq.gpu}</span>
              </div>
            )}
            {minReq.ram_gb && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">RAM</span>
                <span>{minReq.ram_gb} GB</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-auto border-t border-[#1e293b] pt-3 text-[11px] text-slate-500">
            暂无配置需求数据
          </div>
        )}

        {/* Reviews count */}
        {game.recommendations > 0 && (
          <div className="mt-2 text-[10px] text-slate-500">
            {formatRecommendations(game.recommendations)} 条评测
          </div>
        )}
      </div>
    </Link>
  );
}
