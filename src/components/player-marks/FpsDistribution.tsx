"use client";

import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  distribution: { bucket: string; count: number }[];
  gpuDistribution: { gpu: string; count: number }[];
  dict: Dictionary;
}

const BUCKET_COLORS: Record<string, string> = {
  "<30": "#ef4444",
  "30-60": "#f59e0b",
  "60-90": "#22c55e",
  "90-120": "#06b6d4",
  "120+": "#8b5cf6",
};

export default function FpsDistribution({ distribution, gpuDistribution, dict }: Props) {
  const d = dict.marks;
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);
  const totalPlayers = distribution.reduce((s, d) => s + d.count, 0);

  if (totalPlayers === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* FPS 分布 */}
      <div className="p-4 rounded-xl bg-[#1a2233] border border-[#1e293b]">
        <div className="text-[11px] text-slate-600 mb-3">{d.fpsDistribution}</div>
        <div className="flex items-end gap-2 h-12">
          {distribution.map((d) => {
            const color = BUCKET_COLORS[d.bucket] || "#64748b";
            const height = Math.max(4, (d.count / maxCount) * 44);
            const pct = totalPlayers > 0 ? Math.round((d.count / totalPlayers) * 100) : 0;
            return (
              <div key={d.bucket} className="flex-1 text-center">
                <div
                  className="mx-auto rounded-t transition-all"
                  style={{
                    height,
                    background: color,
                    opacity: 0.7,
                    maxWidth: 32,
                  }}
                />
                <div className="text-[10px] text-slate-600 mt-1">{d.bucket}</div>
                <div className="text-[10px] font-semibold" style={{ color }}>
                  {d.count > 0 ? `${pct}%` : "-"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPU 分布 */}
      {gpuDistribution.length > 0 && (
        <div className="p-4 rounded-xl bg-[#1a2233] border border-[#1e293b]">
          <div className="text-[11px] text-slate-600 mb-3">{d.popularGpus}</div>
          <div className="space-y-1.5">
            {gpuDistribution.slice(0, 5).map((g, i) => {
              const maxGpu = gpuDistribution[0].count;
              const width = Math.max(8, (g.count / maxGpu) * 100);
              return (
                <div key={g.gpu} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 h-5 rounded bg-[#111827] overflow-hidden relative">
                    <div
                      className="h-full rounded bg-blue-600/25 transition-all"
                      style={{ width: `${width}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-[11px] text-slate-400 truncate">
                      {g.gpu}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 w-6 text-right">{g.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
