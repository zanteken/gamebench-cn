import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cpus, gpus, predictFPS, type CPU } from "@/lib/fps-predictor";
import { getAllGames } from "@/lib/games";
import { getShopLink, getHardwareShopLink } from "@/lib/affiliate";
import { getDictionary, type Locale, t } from "@/i18n/dictionaries";

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const cpu = cpus.find((c) => c.id === params.slug);
  if (!cpu) return {};
  const isEn = locale === "en";
  return {
    title: isEn
      ? `${cpu.name} Gaming Performance - Best GPU Pairings`
      : `${cpu.name} 游戏性能测试 - 搭配什么显卡最合适？`,
    description: isEn
      ? `${cpu.name} (${cpu.cores} cores) gaming benchmarks with different GPUs. Find the best GPU pairing.`
      : `${cpu.name} (${cpu.cores}核${cpu.threads}线程) 搭配不同显卡的游戏FPS预测。`,
    alternates: { languages: { zh: `/zh/cpu/${cpu.id}`, en: `/en/cpu/${cpu.id}` } },
  };
}

function getTypicalGPU(cpu: CPU) {
  const map: Record<string, string> = { flagship: "rtx-4080", high: "rtx-4070", mid: "rtx-4060", low: "rtx-3060" };
  return gpus.find((g) => g.id === (map[cpu.tier] ?? "rtx-4060")) ?? gpus[0];
}

function FPSBadge({ fps }: { fps: number }) {
  const cls = fps >= 120 ? "bg-emerald-500/10 text-emerald-400" : fps >= 60 ? "bg-lime-500/10 text-lime-400" : fps >= 30 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tabular-nums ${cls}`}>{fps} FPS</span>;
}

export default function CPUPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const cpu = cpus.find((c) => c.id === params.slug);
  if (!cpu) return notFound();

  const typicalGPU = getTypicalGPU(cpu);
  const games = getAllGames();
  const predictions = games
    .map((game) => ({ game, pred: predictFPS(cpu, typicalGPU, 16, game, "1080p", "high") }))
    .sort((a, b) => b.pred.fps - a.pred.fps);

  const over60 = predictions.filter((p) => p.pred.fps >= 60);
  const mid = predictions.filter((p) => p.pred.fps >= 30 && p.pred.fps < 60);
  const shopLink = getShopLink(cpu.name, locale);
  const recommendedGPUs = gpus.filter((g) => Math.abs(g.score - cpu.score) < 25)
    .sort((a, b) => Math.abs(a.score - cpu.score) - Math.abs(b.score - cpu.score)).slice(0, 6);
  const relatedCPUs = cpus.filter((c) => c.id !== cpu.id)
    .sort((a, b) => Math.abs(a.score - cpu.score) - Math.abs(b.score - cpu.score)).slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:text-white transition">{locale === "zh" ? "首页" : "Home"}</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/${locale}/cpu`} className="hover:text-white transition">CPU</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{cpu.name}</span>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{cpu.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {cpu.cores}C{cpu.threads}T · {cpu.baseClock}-{cpu.boostClock}GHz · {cpu.tdp}W · {cpu.year}
          </p>
        </div>
        <a href={shopLink} target="_blank" rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shrink-0">
          {dict.shop.buyButton}
        </a>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { val: `${cpu.score}/100`, label: dict.hardware.perfScore, color: "text-white" },
          { val: over60.length, label: dict.hardware.over60, color: "text-lime-400" },
          { val: mid.length, label: dict.hardware.fps30_60, color: "text-yellow-400" },
          { val: predictions.length - over60.length - mid.length, label: dict.hardware.under30, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-[#1e293b] bg-[#0f1825] px-4 py-3 text-xs text-slate-400">
        {t(dict.hardware.testCondition, { cpu: typicalGPU.name })}
      </div>

      {/* Recommended GPU pairings */}
      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">{dict.hardware.recGPU}</h2>
        <p className="mb-3 text-xs text-slate-400">{t(dict.hardware.recGPUNote, { cpu: cpu.name })}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedGPUs.map((g) => (
            <Link key={g.id} href={`/${locale}/gpu/${g.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-blue-500/30">
              <div><span className="text-sm font-medium text-white">{g.name}</span>
                <span className="ml-2 text-xs text-slate-500">{g.vram}GB</span></div>
              <a href={getHardwareShopLink("gpu", g.name, locale)} target="_blank" rel="noopener noreferrer nofollow"
                onClick={(e) => e.stopPropagation()} className="text-[10px] text-red-400 hover:text-red-300">
                {dict.shop.shopName} →
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* Game lists */}
      {over60.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-lime-500" />
            {dict.hardware.smooth} — {over60.length} {dict.hardware.games}
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {over60.slice(0, 30).map(({ game, pred }) => (
              <Link key={game.appId} href={`/${locale}/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]">
                <span className="truncate text-sm text-slate-300">{locale === "en" && game.nameEn ? game.nameEn : game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">{dict.hardware.relatedCPU}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCPUs.map((c) => (
            <Link key={c.id} href={`/${locale}/cpu/${c.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-[#2a3548]">
              <span className="text-sm font-medium text-white">{c.name}</span>
              <span className="text-xs text-slate-400">{dict.tier.score} {c.score}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
        <p className="text-base font-medium text-white">{t(dict.hardware.wantToBuy, { name: cpu.name })}</p>
        <a href={shopLink} target="_blank" rel="noopener noreferrer nofollow"
          className="mt-3 inline-block rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
          {dict.shop.goToShop}
        </a>
      </div>
    </div>
  );
}
