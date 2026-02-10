import { Metadata } from "next";
import Link from "next/link";
import { cpus } from "@/lib/fps-predictor";

export const metadata: Metadata = {
  title: "CPU天梯榜 - 查看你的处理器游戏性能",
  description: "PC处理器性能排行榜，覆盖Intel Core和AMD Ryzen全系列。点击任意CPU查看搭配不同显卡的游戏表现。",
  keywords: ["CPU天梯榜", "处理器排行", "CPU性能排名", "CPU游戏性能"],
};

export default function CPUIndexPage() {
  const intelCPUs = cpus.filter((c) => c.brand === "Intel").sort((a, b) => b.score - a.score);
  const amdCPUs = cpus.filter((c) => c.brand === "AMD").sort((a, b) => b.score - a.score);

  const tierColor = (score: number) =>
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-blue-500" : score >= 25 ? "bg-yellow-500" : "bg-slate-500";

  const CPUGroup = ({ title, items, color }: { title: string; items: typeof cpus; color: string }) => (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
        <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((cpu) => (
          <Link
            key={cpu.id}
            href={`/cpu/${cpu.id}`}
            className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#131c2e] px-4 py-2.5 transition hover:border-[#2a3548] hover:bg-[#1a2540]"
          >
            <div className="w-16 shrink-0">
              <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
                <div className={`h-full rounded-full ${tierColor(cpu.score)}`} style={{ width: `${cpu.score}%` }} />
              </div>
            </div>
            <span className="flex-1 text-sm font-medium text-white">{cpu.name}</span>
            <span className="hidden sm:inline text-xs text-slate-500">{cpu.cores}核{cpu.threads}线程 · {cpu.year}</span>
            <span className="w-10 text-right text-sm font-bold text-slate-300 tabular-nums">{cpu.score}</span>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">🧠 CPU 天梯榜</h1>
      <p className="mb-6 text-sm text-slate-400">
        点击任意处理器查看搭配不同显卡的游戏表现 · 共 {cpus.length} 款 CPU
      </p>
      <CPUGroup title="Intel Core" items={intelCPUs} color="bg-blue-500" />
      <CPUGroup title="AMD Ryzen" items={amdCPUs} color="bg-red-500" />
    </div>
  );
}
