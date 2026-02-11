/**
 * 游戏详情页 - 国际化版本
 *
 * 这是模板文件，展示如何将你现有的 game/[slug]/page.tsx 迁移到 [locale] 结构。
 * 你需要根据你现有的页面内容修改。
 *
 * 主要改动：
 * 1. params 增加 locale
 * 2. 所有文案用 dict 替换
 * 3. 所有链接加 /${locale} 前缀
 * 4. 导购链接使用 getShopLink(keyword, locale)
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, type Locale, t } from "@/i18n/dictionaries";
import { getAllGames, getGameBySlug, formatDate } from "@/lib/games";
import { getShopLink } from "@/lib/affiliate";
import PlayerMarksSection from "@/components/player-marks/PlayerMarksSection";

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const game = getGameBySlug(params.slug);
  if (!game) return {};

  const recCPU = game.requirements?.recommended?.cpu ?? "N/A";
  const recGPU = game.requirements?.recommended?.gpu ?? "N/A";
  const recRAM = game.requirements?.recommended?.ram_gb ?? "N/A";

  return {
    title: t(dict.game.metaTitle, { game: game.name }),
    description: t(dict.game.metaDesc, { game: game.name, cpu: recCPU, gpu: recGPU, ram: String(recRAM) }),
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
  const displayGenres = locale === "en" && game.genresEn ? game.genresEn : (game.genres || []);
  const displayContentDescriptors = locale === "en" && game.contentDescriptorsEn
    ? game.contentDescriptorsEn
    : (game.contentDescriptors || []);
  const displayDate = formatDate(game.releaseDate, locale);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:text-white transition">
          {locale === "zh" ? "首页" : "Home"}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{displayName}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        {game.headerImage && (
          <img
            src={game.headerImage}
            alt={displayName}
            className="mb-4 w-full rounded-xl object-cover"
          />
        )}
        <h1 className="text-2xl font-bold text-white">{displayName}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-400">
          {game.developers?.length > 0 && (
            <span>{dict.game.developer}: {game.developers.join(", ")}</span>
          )}
          {displayDate && <span>· {dict.game.releaseDate}: {displayDate}</span>}
        </div>

        {/* Genres */}
        {displayGenres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {displayGenres.map((genre: string) => (
              <span key={genre} className="rounded-full border border-[#2a3548] bg-[#111827] px-2.5 py-0.5 text-xs text-slate-400">
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Content Descriptors (暴力、血腥、裸露等) */}
        {displayContentDescriptors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {displayContentDescriptors.map((desc: string) => (
              <span key={desc} className="rounded border border-red-900/30 bg-red-900/10 px-2 py-0.5 text-xs text-red-400">
                {desc}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* System Requirements */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-white">{dict.game.configTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Minimum */}
          <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4">
            <h3 className="mb-3 text-sm font-medium text-yellow-400">{dict.game.minimum}</h3>
            <dl className="space-y-2 text-sm">
              {[
                { label: dict.game.cpu, value: req?.minimum?.cpu },
                { label: dict.game.gpu, value: req?.minimum?.gpu },
                { label: dict.game.ram, value: req?.minimum?.ram_gb ? `${req.minimum.ram_gb} GB` : null },
                { label: dict.game.storage, value: req?.minimum?.storage },
                { label: dict.game.directx, value: req?.minimum?.directx },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-2">
                  <dt className="shrink-0 w-16 text-slate-500">{label}</dt>
                  <dd className="text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Recommended */}
          <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4">
            <h3 className="mb-3 text-sm font-medium text-green-400">{dict.game.recommended}</h3>
            <dl className="space-y-2 text-sm">
              {[
                { label: dict.game.cpu, value: req?.recommended?.cpu },
                { label: dict.game.gpu, value: req?.recommended?.gpu },
                { label: dict.game.ram, value: req?.recommended?.ram_gb ? `${req.recommended.ram_gb} GB` : null },
                { label: dict.game.storage, value: req?.recommended?.storage },
                { label: dict.game.directx, value: req?.recommended?.directx },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-2">
                  <dt className="shrink-0 w-16 text-slate-500">{label}</dt>
                  <dd className="text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FPS Calculator CTA */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
        <p className="text-base font-medium text-white">{dict.game.testFPS}</p>
        <Link href={`/${locale}/fps-calculator`}
          className="mt-3 inline-block rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
          {dict.nav.fpsCalc} →
        </Link>
      </div>

      {/* Steam link */}
      <div className="mt-4 text-center">
        <a href={`https://store.steampowered.com/app/${game.appId}`} target="_blank" rel="noopener noreferrer"
          className="text-sm text-slate-500 hover:text-blue-400 transition">
          {dict.game.viewOnSteam} ↗
        </a>
      </div>

      {/* 玩家印记区域 */}
      <PlayerMarksSection
        gameSlug={game.slug}
        gameAppId={game.appId}
        gameName={displayName}
        locale={locale}
        dict={dict}
      />
    </div>
  );
}
