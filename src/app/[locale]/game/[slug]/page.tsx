/**
 * 游戏详情页 - 增强版
 *
 * 改进内容：
 * 1. 新增 Hero 区域组件 - 大标题、副标题、面包屑、CTA
 * 2. 新增快速检测组件 - 硬件配置对比检测
 * 3. 新增游戏媒体组件 - 预告片 + 截图画廊
 * 4. 新增购买卡片组件 - 多平台购买链接
 * 5. 新增相关游戏组件 - 相似游戏推荐
 * 6. 保留原有系统配置和玩家印记功能
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, type Locale, t } from "@/i18n/dictionaries";
import { getGameBySlug, formatDate } from "@/lib/games";
import PlayerMarksSection from "@/components/player-marks/PlayerMarksSection";
import GameHero from "@/components/game-detail/GameHero";
import QuickCheck from "@/components/game-detail/QuickCheck";
import GameMedia from "@/components/game-detail/GameMedia";
import PurchaseCard from "@/components/game-detail/PurchaseCard";
import SimilarGames from "@/components/game-detail/SimilarGames";

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const game = getGameBySlug(params.slug);
  if (!game) return {};

  const displayName = locale === "en" && game.nameEn ? game.nameEn : game.name;

  const recCPU = game.requirements?.recommended?.cpu ?? "N/A";
  const recGPU = game.requirements?.recommended?.gpu ?? "N/A";
  const recRAM = game.requirements?.recommended?.ram_gb ?? "N/A";

  return {
    title: t(dict.game.metaTitle, { game: displayName }),
    description: t(dict.game.metaDesc, { game: displayName, cpu: recCPU, gpu: recGPU, ram: String(recRAM) }),
    alternates: {
      languages: { zh: `/zh/game/${game.slug}`, en: `/en/game/${game.slug}` },
    },
  };
}

export default function GamePage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const game = getGameBySlug(params.slug);
  if (!game) return notFound();

  const req = game.requirements;

  // 根据语言选择显示的内容
  const displayName = locale === "en" && game.nameEn ? game.nameEn : game.name;
  const displayGenres = locale === "en" && game.genresEn ? game.genresEn : game.genres;
  const displayContentDescriptors = locale === "en" && game.contentDescriptorsEn
    ? game.contentDescriptorsEn
    : game.contentDescriptors;
  const displayDate = game.releaseDate ? (formatDate(game.releaseDate, locale) ?? undefined) : undefined;
  const displayDevelopers = game.developers;
  const displayHeaderImage = game.headerImage;

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Hero Section */}
      <GameHero
        locale={locale}
        gameName={game.name}
        gameNameEn={game.nameEn}
        headerImage={displayHeaderImage}
        developers={displayDevelopers}
        releaseDate={displayDate}
        genres={displayGenres}
        dict={dict}
      />

      {/* Quick Check Section */}
      <QuickCheck locale={locale} dict={dict} />

      {/* Official System Requirements */}
      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-6 text-center">
          <span className="text-xs tracking-widest uppercase text-blue-400/70">Official Specs · {dict.game.officialSpecs}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">{dict.game.configTitle}</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3">
            来自 {displayDevelopers?.[0] || "开发商"} 官方公布的最低与推荐 PC 配置要求。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Minimum */}
          <div className="rounded-lg border border-[#1e293b] bg-[#16202d] overflow-hidden">
            <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
              <h3 className="text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>{dict.game.minimum}</h3>
              <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                Minimum
              </span>
            </div>
            <dl className="p-4 space-y-2 text-sm">
              {[
                { label: dict.game.cpu, value: req?.minimum?.cpu },
                { label: dict.game.gpu, value: req?.minimum?.gpu },
                { label: dict.game.ram, value: req?.minimum?.ram_gb ? `${req.minimum.ram_gb} GB` : null },
                { label: dict.game.storage, value: req?.minimum?.storage },
                { label: dict.game.directx, value: req?.minimum?.directx },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-2">
                  <dt className="shrink-0 w-16 text-slate-500">{label}</dt>
                  <dd className="font-mono text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Recommended */}
          <div className="rounded-lg border border-[#1e293b] bg-[#16202d] overflow-hidden">
            <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
              <h3 className="text-base font-serif" style={{ fontFamily: "'Cinzel', serif" }}>{dict.game.recommended}</h3>
              <span className="text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold">
                Recommended
              </span>
            </div>
            <dl className="p-4 space-y-2 text-sm">
              {[
                { label: dict.game.cpu, value: req?.recommended?.cpu },
                { label: dict.game.gpu, value: req?.recommended?.gpu },
                { label: dict.game.ram, value: req?.recommended?.ram_gb ? `${req.recommended.ram_gb} GB` : null },
                { label: dict.game.storage, value: req?.recommended?.storage },
                { label: dict.game.directx, value: req?.recommended?.directx },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-2">
                  <dt className="shrink-0 w-16 text-slate-500">{label}</dt>
                  <dd className="font-mono text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Game Media Section */}
      <GameMedia locale={locale} gameName={game.name} dict={dict} />

      {/* FPS Calculator CTA */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
          <p className="text-base font-medium text-white">{dict.game.testFPS}</p>
          <Link href={`/${locale}/fps-calculator`}
            className="mt-3 inline-block rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            {dict.nav.fpsCalc} →
          </Link>
        </div>
      </div>

      {/* Purchase Card */}
      <PurchaseCard
        locale={locale}
        gameName={game.name}
        appId={game.appId}
        dict={dict}
      />

      {/* Steam link - small */}
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <a
          href={`https://store.steampowered.com/app/${game.appId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-500 hover:text-blue-400 transition"
        >
          {dict.game.viewOnSteam} ↗
        </a>
      </div>

      {/* Player Marks Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <PlayerMarksSection
          gameSlug={game.slug}
          gameAppId={game.appId}
          gameName={displayName}
          locale={locale}
          dict={dict}
        />
      </div>

      {/* Similar Games */}
      <SimilarGames
        locale={locale}
        currentGameSlug={game.slug}
        genres={displayGenres}
        dict={dict}
      />

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
}
