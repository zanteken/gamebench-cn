import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cpus, gpus, predictFPS, type CPU } from "@/lib/fps-predictor";
import { getAllGames } from "@/lib/games";
import { getJDSearchLink } from "@/lib/jd-affiliate";

export function generateStaticParams() {
  return cpus.map((cpu) => ({ slug: cpu.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cpu = cpus.find((c) => c.id === params.slug);
  if (!cpu) return {};
  return {
    title: `${cpu.name} 游戏性能测试 - 搭配什么显卡最合适？`,
    description: `${cpu.name} (${cpu.cores}核${cpu.threads}线程) 搭配不同显卡的游戏FPS预测。看看这块CPU配什么显卡最划算。`,
    keywords: [cpu.name, `${cpu.name} 配什么显卡`, `${cpu.name} 游戏性能`, `${cpu.name} FPS`, "CPU显卡搭配"],
  };
}

function getTypicalGPU(cpu: CPU) {
  const map: Record<string, string> = { flagship: "rtx-4080", high: "rtx-4070", mid: "rtx-4060", low: "rtx-3060" };
  const id = map[cpu.tier] ?? "rtx-4060";
  return gpus.find((g) => g.id === id) ?? gpus[0];
}

function FPSBadge({ fps }: { fps: number }) {
  const cls = fps >= 120 ? "bg-emerald-500/10 text-emerald-400" : fps >= 60 ? "bg-lime-500/10 text-lime-400" : fps >= 30 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tabular-nums ${cls}`}>{fps} FPS</span>;
}

export default function CPUPage({ params }: { params: { slug: string } }) {
  const cpu = cpus.find((c) => c.id === params.slug);
  if (!cpu) return notFound();

  const typicalGPU = getTypicalGPU(cpu);
  const games = getAllGames();

  const predictions = games
    .map((game) => ({ game, pred: predictFPS(cpu, typicalGPU, 16, game, "1080p", "high") }))
    .sort((a, b) => b.pred.fps - a.pred.fps);

  const over60 = predictions.filter((p) => p.pred.fps >= 60);
  const between30_60 = predictions.filter((p) => p.pred.fps >= 30 && p.pred.fps < 60);
  const under30 = predictions.filter((p) => p.pred.fps < 30);

  const jdKeyword = cpu.brand === "Intel" ? `${cpu.name} 处理器` : `${cpu.name.replace("AMD ", "")} 处理器`;
  const jdLink = getJDSearchLink(jdKeyword);

  // 推荐搭配的显卡
  const recommendedGPUs = gpus
    .filter((g) => Math.abs(g.score - cpu.score) < 25)
    .sort((a, b) => Math.abs(a.score - cpu.score) - Math.abs(b.score - cpu.score))
    .slice(0, 6);

  const relatedCPUs = cpus
    .filter((c) => c.id !== cpu.id)
    .sort((a, b) => Math.abs(a.score - cpu.score) - Math.abs(b.score - cpu.score))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition">首页</Link>
        <span className="mx-1.5">/</span>
        <Link href="/cpu" className="hover:text-white transition">CPU</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{cpu.name}</span>
      </nav>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{cpu.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {cpu.cores}核{cpu.threads}线程 · {cpu.baseClock}-{cpu.boostClock}GHz · {cpu.tdp}W TDP · {cpu.year}年
          </p>
        </div>
        <a href={jdLink} target="_blank" rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shrink-0">
          🛒 京东查看价格
        </a>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
          <div className="text-2xl font-bold text-white">{cpu.score}<span className="text-sm text-slate-500">/100</span></div>
          <div className="text-[10px] text-slate-500 mt-1">性能评分</div>
        </div>
        <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
          <div className="text-2xl font-bold text-lime-400">{over60.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">60FPS+ 游戏</div>
        </div>
        <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{between30_60.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">30-60 FPS</div>
        </div>
        <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{under30.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">30FPS 以下</div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-[#1e293b] bg-[#0f1825] px-4 py-3 text-xs text-slate-400">
        📋 测试条件：搭配 {typicalGPU.name} · 16GB 内存 · 1080p · 高画质
      </div>

      {/* 推荐搭配显卡 */}
      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">🔗 推荐搭配显卡</h2>
        <p className="mb-3 text-xs text-slate-400">以下显卡与 {cpu.name} 性能匹配度最高，不会产生明显瓶颈：</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedGPUs.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5">
              <Link href={`/gpu/${g.id}`} className="flex items-center gap-2 hover:text-blue-400 transition">
                <span className="text-sm font-medium text-white">{g.name}</span>
                <span className="text-xs text-slate-500">{g.vram}GB</span>
              </Link>
              <a href={getJDSearchLink(`${g.name} 显卡`)} target="_blank" rel="noopener noreferrer nofollow"
                className="text-[10px] text-red-400 hover:text-red-300">
                京东 →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 游戏列表 */}
      {over60.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-lime-500" />
            流畅运行 (≥60 FPS) — {over60.length} 款
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {over60.slice(0, 30).map(({ game, pred }) => (
              <Link key={game.appId} href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]">
                <span className="truncate text-sm text-slate-300">{game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {between30_60.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" />
            基本可玩 (30-60 FPS) — {between30_60.length} 款
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {between30_60.slice(0, 20).map(({ game, pred }) => (
              <Link key={game.appId} href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]">
                <span className="truncate text-sm text-slate-300">{game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 相近CPU */}
      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">📊 相近性能的处理器</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCPUs.map((c) => (
            <Link key={c.id} href={`/cpu/${c.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-[#2a3548]">
              <span className="text-sm font-medium text-white">{c.name}</span>
              <span className="text-xs text-slate-400">评分 {c.score}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
        <p className="text-base font-medium text-white">想入手 {cpu.name}？</p>
        <a href={jdLink} target="_blank" rel="noopener noreferrer nofollow"
          className="mt-3 inline-block rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-red-700">
          🛒 前往京东
        </a>
      </div>
    </div>
  );
}
