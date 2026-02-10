import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { gpus, cpus, predictFPS, type GPU } from "@/lib/fps-predictor";
import { getAllGames } from "@/lib/games";
import { getJDSearchLink } from "@/lib/jd-affiliate";

// 静态生成所有 GPU 页面
export function generateStaticParams() {
  return gpus.map((gpu) => ({ slug: gpu.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const gpu = gpus.find((g) => g.id === params.slug);
  if (!gpu) return {};

  return {
    title: `${gpu.name} 能玩什么游戏？配置需求与FPS预测`,
    description: `查看 ${gpu.name} (${gpu.vram}GB) 能流畅运行哪些游戏，预测FPS帧数。覆盖5000+款PC游戏，帮你判断这块显卡够不够用。`,
    keywords: [
      gpu.name, `${gpu.name} 能玩什么`, `${gpu.name} FPS`,
      `${gpu.name} 游戏性能`, `${gpu.name} 配置`, "显卡游戏兼容性",
    ],
  };
}

// 给每个 GPU 配一个"典型搭配CPU"来做预测
function getTypicalCPU(gpu: GPU) {
  const cpuMap: Record<string, string> = {
    flagship: "i7-14700K",
    high: "i5-14600KF",
    mid: "i5-12400F",
    low: "i3-12100F",
  };
  const targetId = cpuMap[gpu.tier] ?? "i5-12400F";
  return cpus.find((c) => c.id === targetId) ?? cpus[0];
}

function FPSBadge({ fps }: { fps: number }) {
  const cls =
    fps >= 120 ? "bg-emerald-500/10 text-emerald-400" :
    fps >= 60  ? "bg-lime-500/10 text-lime-400" :
    fps >= 30  ? "bg-yellow-500/10 text-yellow-400" :
                 "bg-red-500/10 text-red-400";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tabular-nums ${cls}`}>
      {fps} FPS
    </span>
  );
}

export default function GPUPage({ params }: { params: { slug: string } }) {
  const gpu = gpus.find((g) => g.id === params.slug);
  if (!gpu) return notFound();

  const typicalCPU = getTypicalCPU(gpu);
  const games = getAllGames();

  // 预测所有游戏
  const predictions = games
    .map((game) => ({
      game,
      pred: predictFPS(typicalCPU, gpu, 16, game, "1080p", "high"),
    }))
    .sort((a, b) => b.pred.fps - a.pred.fps);

  const over60 = predictions.filter((p) => p.pred.fps >= 60);
  const between30_60 = predictions.filter((p) => p.pred.fps >= 30 && p.pred.fps < 60);
  const under30 = predictions.filter((p) => p.pred.fps < 30);

  const jdLink = getJDSearchLink(`${gpu.name} 显卡`);

  // 找同系列的其他GPU
  const relatedGPUs = gpus
    .filter((g) => g.id !== gpu.id)
    .sort((a, b) => Math.abs(a.score - gpu.score) - Math.abs(b.score - gpu.score))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl">
      {/* 面包屑 */}
      <nav className="mb-4 text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition">首页</Link>
        <span className="mx-1.5">/</span>
        <Link href="/gpu" className="hover:text-white transition">显卡</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-300">{gpu.name}</span>
      </nav>

      {/* 标题 */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{gpu.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {gpu.vram}GB 显存 · {gpu.series} · {gpu.year}年
          </p>
        </div>
        <a
          href={jdLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 shrink-0"
        >
          🛒 京东查看价格
        </a>
      </div>

      {/* 性能概览 */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-4 text-center">
          <div className="text-2xl font-bold text-white">{gpu.score}<span className="text-sm text-slate-500">/100</span></div>
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

      {/* 测试说明 */}
      <div className="mb-6 rounded-lg border border-[#1e293b] bg-[#0f1825] px-4 py-3 text-xs text-slate-400">
        📋 测试条件：搭配 {typicalCPU.name} · 16GB 内存 · 1080p 分辨率 · 高画质预设
        <br />
        <span className="text-slate-600">预测值仅供参考（±20%），实际帧数受驱动、温度等因素影响。</span>
      </div>

      {/* 流畅运行的游戏 */}
      {over60.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-lime-500" />
            流畅运行 (≥60 FPS) — {over60.length} 款
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {over60.slice(0, 40).map(({ game, pred }) => (
              <Link
                key={game.appId}
                href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]"
              >
                <span className="truncate text-sm text-slate-300 hover:text-white">{game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
          {over60.length > 40 && (
            <p className="mt-2 text-center text-xs text-slate-600">
              还有 {over60.length - 40} 款游戏可流畅运行...
              <Link href="/fps-calculator" className="text-blue-400 hover:underline ml-1">使用FPS计算器查看全部</Link>
            </p>
          )}
        </section>
      )}

      {/* 基本可玩 */}
      {between30_60.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" />
            基本可玩 (30-60 FPS) — {between30_60.length} 款
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {between30_60.slice(0, 20).map(({ game, pred }) => (
              <Link
                key={game.appId}
                href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]"
              >
                <span className="truncate text-sm text-slate-300">{game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 无法流畅运行 */}
      {under30.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
            不推荐 (&lt;30 FPS) — {under30.length} 款
          </h2>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {under30.slice(0, 10).map(({ game, pred }) => (
              <Link
                key={game.appId}
                href={`/game/${game.slug}`}
                className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2 transition hover:border-[#2a3548]"
              >
                <span className="truncate text-sm text-slate-300">{game.name}</span>
                <FPSBadge fps={pred.fps} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 相关显卡 */}
      <section className="mb-8">
        <h2 className="mb-3 text-base font-bold text-white">📊 相近性能的显卡</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {relatedGPUs.map((g) => (
            <Link
              key={g.id}
              href={`/gpu/${g.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-[#2a3548]"
            >
              <div>
                <span className="text-sm font-medium text-white">{g.name}</span>
                <span className="ml-2 text-xs text-slate-500">{g.vram}GB</span>
              </div>
              <span className="text-xs text-slate-400">评分 {g.score}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 京东CTA */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
        <p className="text-base font-medium text-white">想入手 {gpu.name}？</p>
        <p className="mt-1 text-sm text-slate-400">查看京东最新价格和评价</p>
        <a
          href={jdLink}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-3 inline-block rounded-lg bg-red-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
        >
          🛒 前往京东
        </a>
      </div>
    </div>
  );
}
