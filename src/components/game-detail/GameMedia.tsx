"use client";

import { useState } from "react";
import { Dictionary } from "@/i18n/dictionaries";

interface Props {
  locale: string;
  gameName: string;
  dict: Dictionary;
}

export default function GameMedia({ locale, gameName, dict }: Props) {
  const [activeTab, setActiveTab] = useState<"trailer" | "screenshots">("screenshots");

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {/* Section Label */}
      <div className="mb-6 text-center">
        <span className="text-xs tracking-widest uppercase text-blue-400/70">Media · 游戏媒体</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">游戏预告片与截图</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3">
          了解游戏画面风格，观看预告片，浏览游戏内截图。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#16202d] border border-[#1e293b] rounded-lg p-1 w-fit mx-auto">
        <button
          onClick={() => setActiveTab("screenshots")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "screenshots"
              ? "bg-blue-500 text-[#0a0e17]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {dict.game.screenshots}
        </button>
        <button
          onClick={() => setActiveTab("trailer")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "trailer"
              ? "bg-blue-500 text-[#0a0e17]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          {dict.game.trailer}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "screenshots" ? (
        /* Screenshots Gallery */
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
          {[
            "利夫雷夫 截图",
            "化圣雪原 截图",
            "黄金树 截图",
            "Boss 战斗 截图",
            "开放世界 截图",
            "DLC 幽影树 截图",
          ].map((label, i) => (
            <div
              key={i}
              className="min-w-[280px] h-[160px] flex-shrink-0 bg-[#0f1825] rounded-lg border border-[#1e293b] flex items-center justify-center text-slate-500 text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      ) : (
        /* Trailer Placeholder */
        <div className="aspect-video bg-[#0f1825] rounded-xl border border-[#1e293b] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">▶</div>
            <p className="text-slate-500">游戏预告片占位符</p>
            <p className="text-xs text-slate-600 mt-2">实际使用时嵌入 YouTube 或 Bilibili 视频</p>
          </div>
        </div>
      )}
    </section>
  );
}
