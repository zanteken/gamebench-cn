import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getGameBySlug,
  formatPrice,
  formatRecommendations,
} from "@/lib/games";
import GameImage from "@/components/GameImage";
import RequirementsTable from "@/components/RequirementsTable";

// ====== SSG: 预生成所有游戏页面 ======
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ====== SEO: 动态生成 meta 标签 ======
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const game = getGameBySlug(params.slug);
  if (!game) return { title: "游戏未找到" };

  const minReq = game.requirements.minimum;
  const description = `${game.name} 的 PC 配置需求：${
    minReq.cpu ? `最低CPU ${minReq.cpu}` : ""
  }${minReq.gpu ? `，最低GPU ${minReq.gpu}` : ""}${
    minReq.ram_gb ? `，最低 ${minReq.ram_gb}GB 内存` : ""
  }。查看完整配置需求和 FPS 预测。`;

  return {
    title: `${game.name} 配置需求 - 最低配置与推荐配置`,
    description,
    keywords: [
      game.name,
      `${game.name} 配置`,
      `${game.name} 系统要求`,
      `${game.name} 最低配置`,
      `${game.name} 推荐配置`,
      ...game.genres,
    ],
    openGraph: {
      title: `${game.name} - PC 配置需求`,
      description,
      images: game.headerImage ? [game.headerImage] : [],
    },
  };
}

// ====== 页面组件 ======
export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);
  if (!game) notFound();

  const minReq = game.requirements.minimum;
  const recReq = game.requirements.recommended;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-400">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{game.name}</span>
      </nav>

      {/* Hero: Image + Basic Info */}
      <div className="mb-8 overflow-hidden rounded-xl border border-[#1e293b] bg-[#1a2233]">
        <div className="relative aspect-[21/9] w-full bg-[#111827]">
          <GameImage
            src={game.headerImage}
            alt={game.name}
            appId={game.appId}
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2233] via-transparent to-transparent" />
        </div>

        <div className="relative -mt-16 px-6 pb-6">
          <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
            {game.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Price */}
            <span className="rounded bg-brand-600/20 px-2.5 py-1 font-medium text-brand-400">
              {formatPrice(game.price, game.isFree)}
            </span>

            {/* Genres */}
            {game.genres.map((genre) => (
              <span
                key={genre}
                className="rounded bg-[#111827] px-2 py-1 text-xs text-slate-400"
              >
                {genre}
              </span>
            ))}

            {/* Release date */}
            {game.releaseDate && (
              <span className="text-xs text-slate-500">
                📅 {game.releaseDate}
              </span>
            )}

            {/* Reviews */}
            {game.recommendations > 0 && (
              <span className="text-xs text-slate-500">
                💬 {formatRecommendations(game.recommendations)} 条评测
              </span>
            )}
          </div>

          {/* Developer / Publisher */}
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            {game.developers.length > 0 && (
              <span>开发商：{game.developers.join(", ")}</span>
            )}
            {game.publishers.length > 0 && (
              <span>发行商：{game.publishers.join(", ")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Requirements Table */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-white">
            📋 PC 配置需求
          </h2>
          <RequirementsTable minimum={minReq} recommended={recReq} />

          {/* Schema.org structured data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoGame",
                name: game.name,
                gamePlatform: "PC",
                applicationCategory: "Game",
                image: game.headerImage,
                author: game.developers.map((d) => ({
                  "@type": "Organization",
                  name: d,
                })),
                genre: game.genres,
                datePublished: game.releaseDate,
              }),
            }}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* FPS Calculator CTA */}
          <div className="rounded-xl border border-brand-600/30 bg-brand-600/5 p-5">
            <h3 className="mb-2 text-sm font-bold text-brand-400">
              🎯 你的电脑能跑多少帧？
            </h3>
            <p className="mb-3 text-xs text-slate-400">
              输入你的 CPU 和 GPU，预测 {game.name} 的 FPS 帧数
            </p>
            <Link
              href="/fps-calculator"
              className="block rounded-lg bg-brand-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
            >
              打开 FPS 计算器
            </Link>
          </div>

          {/* Quick Specs Summary */}
          <div className="rounded-xl border border-[#1e293b] bg-[#1a2233] p-5">
            <h3 className="mb-3 text-sm font-bold text-white">
              ⚡ 快速摘要
            </h3>
            <div className="space-y-2.5">
              {minReq.storage && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">安装大小</span>
                  <span className="font-medium text-white">
                    {minReq.storage}
                  </span>
                </div>
              )}
              {minReq.directx && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">DirectX</span>
                  <span className="font-medium text-white">
                    {minReq.directx}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">平台</span>
                <span className="font-medium text-white">
                  {[
                    game.platforms.windows && "Windows",
                    game.platforms.mac && "Mac",
                    game.platforms.linux && "Linux",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
              {game.metacritic && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Metacritic</span>
                  <span
                    className={`font-bold ${
                      game.metacritic.score >= 75
                        ? "text-green-400"
                        : game.metacritic.score >= 50
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {game.metacritic.score}/100
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Steam Link */}
          <a
            href={`https://store.steampowered.com/app/${game.appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-[#1e293b] bg-[#1a2233] py-3 text-sm text-slate-400 transition hover:border-slate-600 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .128.003.191.007l2.862-4.145V8.9a4.53 4.53 0 0 1 4.522-4.522 4.53 4.53 0 0 1 4.523 4.522 4.53 4.53 0 0 1-4.523 4.523h-.105l-4.076 2.91c0 .052.003.105.003.159a3.393 3.393 0 0 1-3.386 3.386 3.397 3.397 0 0 1-3.336-2.806L.153 14.233C1.308 19.845 6.165 24 12.004 24c6.627 0 12-5.373 12-12S18.63 0 11.979 0z" />
            </svg>
            在 Steam 上查看
          </a>
        </div>
      </div>
    </div>
  );
}
