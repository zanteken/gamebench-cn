"use client";

import { useMemo } from "react";
import type { CPU, GPU } from "@/lib/fps-predictor";
import type { Locale, Dictionary } from "@/i18n/dictionaries";
import { getUpgradeRecommendations, getShopLink, type UpgradeRecommendation } from "@/lib/affiliate";

function TierBadge({ tier, dict }: { tier: "budget" | "value" | "premium"; dict: Dictionary }) {
  const cls = {
    budget: "bg-green-500/10 text-green-400 border-green-500/20",
    value: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }[tier];
  const label = {
    budget: dict.upgrade.tierBudget,
    value: dict.upgrade.tierValue,
    premium: dict.upgrade.tierPremium,
  }[tier];
  return (
    <span className={`rounded-full border px-1.5 py-px text-[9px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

function RecommendationCard({
  rec,
  locale,
  dict,
}: {
  rec: UpgradeRecommendation;
  locale: Locale;
  dict: Dictionary;
}) {
  const icons = { cpu: "🧠", gpu: "🎮", ram: "💾" };
  const labels = {
    cpu: dict.upgrade.cpuUpgrade,
    gpu: dict.upgrade.gpuUpgrade,
    ram: dict.upgrade.ramUpgrade,
  };
  const priorityColor = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-slate-500",
  }[rec.priority];

  return (
    <div className={`rounded-lg border border-[#1e293b] bg-[#0f1825] border-l-2 ${priorityColor}`}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{icons[rec.type]}</span>
          <span className="text-xs font-medium text-slate-300">{labels[rec.type]}</span>
        </div>
        {rec.priority === "high" && (
          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400 border border-red-500/20">
            {dict.upgrade.priorityHigh}
          </span>
        )}
      </div>
      <div className="px-4 pb-2">
        <p className="text-xs text-slate-400">{locale === "zh" ? rec.reasonZh : rec.reasonEn}</p>
        <p className="mt-1 text-[10px] text-slate-600">{rec.currentLevel}</p>
      </div>
      <div className="px-3 pb-3 space-y-1.5">
        {rec.products.map((product, i) => (
          <a
            key={i}
            href={getShopLink(product.name, locale)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex items-center gap-3 rounded-md bg-[#131c2e] px-3 py-2.5 transition hover:bg-[#1a2540] group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition">
                  {product.name}
                </span>
                <TierBadge tier={product.tier} dict={dict} />
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {locale === "zh" ? product.reason : product.reasonEn}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-medium text-orange-400">
                {locale === "zh" ? product.priceZh : product.priceEn}
              </div>
              <div className="text-[10px] text-slate-600 group-hover:text-blue-400 transition">
                {dict.upgrade.shopCTA}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function UpgradePanel({
  cpu, gpu, ram, bottleneck, locale, dict,
}: {
  cpu: CPU;
  gpu: GPU;
  ram: number;
  bottleneck: "cpu" | "gpu" | "balanced";
  locale: Locale;
  dict: Dictionary;
}) {
  const recs = useMemo(
    () => getUpgradeRecommendations(cpu, gpu, ram, bottleneck),
    [cpu, gpu, ram, bottleneck]
  );

  if (recs.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-base font-bold text-white">{dict.upgrade.title}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {recs.map((rec, i) => (
          <RecommendationCard key={`${rec.type}-${i}`} rec={rec} locale={locale} dict={dict} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-slate-600 text-center">{dict.upgrade.priceNote}</p>
    </div>
  );
}
