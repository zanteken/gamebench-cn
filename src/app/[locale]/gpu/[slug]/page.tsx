import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { gpus, cpus, predictFPS, type GPU } from "@/lib/fps-predictor";
import { getAllGames } from "@/lib/games";
import { getShopLink } from "@/lib/affiliate";
import { getDictionary, type Locale, t } from "@/i18n/dictionaries";

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const gpu = gpus.find((g) => g.id === params.slug);
  if (!gpu) return {};
  const isEn = locale === "en";
  return {
    title: isEn
      ? `${gpu.name} - Can It Run? Game FPS Predictions`
      : `${gpu.name} 能玩什么游戏？配置需求与FPS预测`,
    description: isEn
      ? `See which games the ${gpu.name} (${gpu.vram}GB) can run smoothly. FPS predictions for 5000+ PC games.`
      : `查看 ${gpu.name} (${gpu.vram}GB) 能流畅运行哪些游戏，预测FPS帧数。`,
    alternates: { languages: { zh: `/zh/gpu/${gpu.id}`, en: `/en/gpu/${gpu.id}` } },
  };
}

function getTypicalCPU(gpu: GPU) {
  const map: Record<string, string> = { flagship: "i7-14700K", high: "i5-14600KF", mid: "i5-12400F", low: "i3-12100F" };
  return cpus.find((c) => c.id === (map[gpu.tier] ?? "i5-12400F")) ?? cpus[0];
}

function FPSBadge({ fps }: { fps: number }) {
  const cls = fps >= 120 ? "bg-emerald-500/10 text-emerald-400" : fps >= 60 ? "bg-lime-500/10 text-lime-400" : fps >= 30 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tabular-nums ${cls}`}>{fps} FPS</span>;
}

export default function GPUPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const gpu = gpus.find((g) => g.id === params.slug);
  if (!gpu) return notFound();

  const typicalCPU = getTypicalCPU(gpu);

  // 只计算前 100 款热门游戏，而不是全部
  const allGames = getAllGames();
  const games = allGames.slice(0, 100);
  const predictions = games
    .map((game) => ({ game, pred: predictFPS(typicalCPU, gpu, 16, game, "1080p", "high") }))
    .sort((a, b) => b.pred.fps - a.pred.fps);

  const over60 = predictions.filter((p) => p.pred.fps >= 60);
  const mid = predictions.filter((p) => p.pred.fps >= 30 && p.pred.fps < 60);
  const under30 = predictions.filter((p) => p.pred.fps < 30);
  const shopLink = getShopLink(`${gpu.name}`, locale);
  const relatedGPUs = gpus.filter((g) => g.id !== gpu.id).sort((a, b) => Math.abs(a.score - gpu.score) - Math.abs(b.score - gpu.score)).slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:text-white transition">{locale === "zh" ? "首页" : "Home"}</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/${locale}/gpu`} className="hover:text-white transition">{locale === "zh" ? "显卡" : "GPUs"}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{gpu.name}</span>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{gpu.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{gpu.vram}GB · {gpu.series} · {gpu.year}</p>
        </div>
        <a href={shopLink} target="_blank" rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shrink-0">
          {dict.shop.buyButton}
        </a>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { val: `${gpu.score}/100`, label: dict.hardware.perfScore, color: "text-white" },
          { val: over60.length, label: dict.hardware.over60, color: "text-lime-400" },
          { val: mid.length, label: dict.hardware.fps30_60, color: "text-yellow-400" },
          { val: under30.length, label: dict.hardware.under30, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg border border-[#1e293b] bg-[#0f1825] px-4 py-3 text-xs text-slate-400">
        {t(dict.hardware.testCondition, { cpu: typicalCPU.name })}
        <br /><span className="text-slate-600">{dict.hardware.testNote}</span>
      </div>

      {/* Game lists */}
      {[
        { list: over60, title: dict.hardware.smooth, color: "bg-lime-500", limit: 40 },
        { list: mid, title: dict.hardware.playable, color: "bg-yellow-500", limit: 20 },
        { list: under30, title: dict.hardware.notRecommended, color: "bg-red-500", limit: 10 },
      ].map(({ list, title, color, limit }) => list.length > 0 && (
        <section key={title} className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
            {title} — {list.length} {dict.hardware.games}
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {list.slice(0, limit).map(({ game, pred }) => (
              <Link key={game.appId} href={`/${locale}/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]">
                <span className="truncate text-sm text-slate-300">{locale === "en" && game.nameEn ? game.nameEn : game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">{dict.hardware.relatedGPU}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {relatedGPUs.map((g) => (
            <Link key={g.id} href={`/${locale}/gpu/${g.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-[#2a3548]">
              <div><span className="text-sm font-medium text-white">{g.name}</span>
                <span className="ml-2 text-xs text-slate-500">{g.vram}GB</span></div>
              <span className="text-xs text-slate-400">{dict.tier.score} {g.score}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
        <p className="text-base font-medium text-white">{t(dict.hardware.wantToBuy, { name: gpu.name })}</p>
        <p className="mt-1 text-sm text-slate-400">{dict.hardware.checkPrice}</p>
        <a href={shopLink} target="_blank" rel="noopener noreferrer nofollow"
          className="mt-3 inline-block rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
          {dict.shop.goToShop}
        </a>
      </div>
    </div>
  );
}
