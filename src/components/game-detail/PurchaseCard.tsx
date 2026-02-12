"use client";

import Link from "next/link";
import { Dictionary } from "@/i18n/dictionaries";

interface Props {
  locale: string;
  gameName: string;
  appId: number;
  dict: Dictionary;
}

export default function PurchaseCard({ locale, gameName, appId, dict }: Props) {
  const steamUrl = `https://store.steampowered.com/app/${appId}`;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Section Label */}
      <div className="mb-6 text-center">
        <span className="text-xs tracking-widest uppercase text-blue-400/70">Buy · 购买</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">确认能跑？去买吧</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3">
          以下为各平台购买链接，PC 版建议通过 Steam 购买以获得自动更新和社区支持。
        </p>
      </div>

      {/* Purchase Buttons */}
      <div className="flex flex-wrap gap-4">
        {/* Steam */}
        <a
          href={steamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[200px] flex items-center gap-3 px-7 py-4 bg-[#16202d] border border-[#1e293b] rounded-lg hover:border-blue-500/50 hover:-translate-y-0.5 transition-all text-slate-300 text-sm"
        >
          <span className="text-2xl">🎮</span>
          <div>
            <div className="font-medium">Steam</div>
            <div className="text-xs text-slate-500">PC · 支持手柄 · 云存档</div>
          </div>
          <span className="ml-auto font-mono text-green-400">¥298</span>
        </a>

        {/* Xbox */}
        <a
          href="#"
          className="flex-1 min-w-[200px] flex items-center gap-3 px-7 py-4 bg-[#16202d] border border-[#1e293b] rounded-lg hover:border-blue-500/50 hover:-translate-y-0.5 transition-all text-slate-300 text-sm"
        >
          <span className="text-2xl">🟢</span>
          <div>
            <div className="font-medium">Xbox</div>
            <div className="text-xs text-slate-500">Xbox Series X|S · Game Pass</div>
          </div>
          <span className="ml-auto font-mono text-green-400">¥298</span>
        </a>

        {/* PlayStation */}
        <a
          href="#"
          className="flex-1 min-w-[200px] flex items-center gap-3 px-7 py-4 bg-[#16202d] border border-[#1e293b] rounded-lg hover:border-blue-500/50 hover:-translate-y-0.5 transition-all text-slate-300 text-sm"
        >
          <span className="text-2xl">🔵</span>
          <div>
            <div className="font-medium">PlayStation</div>
            <div className="text-xs text-slate-500">PS5 · PS4</div>
          </div>
          <span className="ml-auto font-mono text-green-400">¥398</span>
        </a>
      </div>

      {/* Note */}
      <p className="text-center text-xs text-slate-600 mt-6">
        * 价格仅供参考，以各平台实际价格为准。
      </p>
    </section>
  );
}
