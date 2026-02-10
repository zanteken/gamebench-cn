"use client";

import { useMemo } from "react";
import type { CPU, GPU } from "@/lib/fps-predictor";
import { getUpgradeRecommendations, type UpgradeRecommendation } from "@/lib/jd-affiliate";

function TierBadge({ tier }: { tier: "budget" | "value" | "premium" }) {
  const cls = {
    budget: "bg-green-500/10 text-green-400 border-green-500/20",
    value: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }[tier];
  const label = { budget: "高性价比", value: "推荐", premium: "旗舰" }[tier];
  return (
    <span className={`rounded-full border px-1.5 py-px text-[9px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

function TypeIcon({ type }: { type: "cpu" | "gpu" | "ram" }) {
  const icons = { cpu: "🧠", gpu: "🎮", ram: "💾" };
  const labels = { cpu: "处理器", gpu: "显卡", ram: "内存" };
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-lg">{icons[type]}</span>
      <span className="text-xs font-medium text-slate-300">{labels[type]}升级方案</span>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: UpgradeRecommendation }) {
  const priorityColor = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-slate-500",
  }[rec.priority];

  return (
    <div className={`rounded-lg border border-[#1e293b] bg-[#0f1825] border-l-2 ${priorityColor}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <TypeIcon type={rec.type} />
        {rec.priority === "high" && (
          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400 border border-red-500/20">
            优先升级
          </span>
        )}
      </div>

      {/* 原因 */}
      <div className="px-4 pb-2">
        <p className="text-xs text-slate-400">{rec.reason}</p>
        <p className="mt-1 text-[10px] text-slate-600">当前：{rec.currentLevel}</p>
      </div>

      {/* 商品推荐 */}
      <div className="px-3 pb-3 space-y-1.5">
        {rec.suggestedProducts.map((product, i) => (
          <a
            key={i}
            href={product.jdLink}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center gap-3 rounded-md bg-[#131c2e] px-3 py-2.5 transition hover:bg-[#1a2540] group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition">
                  {product.name}
                </span>
                <TierBadge tier={product.tier} />
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">{product.reason}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-medium text-orange-400">{product.priceRange}</div>
              <div className="text-[10px] text-slate-600 group-hover:text-blue-400 transition">
                京东查看 →
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function UpgradePanel({
  cpu,
  gpu,
  ram,
  bottleneck,
}: {
  cpu: CPU;
  gpu: GPU;
  ram: number;
  bottleneck: "cpu" | "gpu" | "balanced";
}) {
  const recommendations = useMemo(
    () => getUpgradeRecommendations(cpu, gpu, ram, bottleneck),
    [cpu, gpu, ram, bottleneck]
  );

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-base font-bold text-white">⬆️ 升级建议</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {recommendations.map((rec, i) => (
          <RecommendationCard key={`${rec.type}-${i}`} rec={rec} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-slate-600 text-center">
        价格仅供参考，以京东实时价格为准 · 点击商品名可跳转京东查看详情
      </p>
    </div>
  );
}
