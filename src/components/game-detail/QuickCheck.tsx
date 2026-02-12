"use client";

import { useState } from "react";
import { Dictionary } from "@/i18n/dictionaries";

interface Props {
  locale: string;
  dict: Dictionary;
}

export default function QuickCheck({ locale, dict }: Props) {
  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [showResult, setShowResult] = useState(false);

  const canCheck = cpu && gpu;

  const handleCheck = () => {
    if (canCheck) {
      setShowResult(true);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Section Label */}
      <div className="mb-8 text-center">
        <span className="text-xs tracking-widest uppercase text-blue-400/70">Quick Check · {dict.game.quickCheck}</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">我的电脑能玩吗？</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3">
          输入你的硬件配置，即刻获得运行评估。系统将对比官方需求与玩家实测数据，给出可靠建议。
        </p>
      </div>

      {/* Quick Check Box */}
      <div className="rounded-xl bg-[#16202d] border border-[#1e293b] overflow-hidden relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />

        <div className="p-6 md:p-10">
          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {/* CPU Select */}
            <div className="input-group">
              <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">
                {dict.game.cpu}
              </label>
              <select
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-slate-300 text-sm outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="">选择你的 CPU...</option>
                <option>Intel Core i5-8400</option>
                <option>Intel Core i5-12400F</option>
                <option>Intel Core i7-12700</option>
                <option>AMD Ryzen 5 3600</option>
                <option>AMD Ryzen 5 5600X</option>
                <option>AMD Ryzen 7 5800X</option>
              </select>
            </div>

            {/* GPU Select */}
            <div className="input-group">
              <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">
                {dict.game.gpu}
              </label>
              <select
                value={gpu}
                onChange={(e) => setGpu(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-slate-300 text-sm outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="">选择你的显卡...</option>
                <option>NVIDIA GTX 1060 6GB</option>
                <option>NVIDIA GTX 1660 Super</option>
                <option>NVIDIA RTX 3060</option>
                <option>NVIDIA RTX 3070</option>
                <option>NVIDIA RTX 4060</option>
                <option>AMD RX 580 8GB</option>
                <option>AMD RX 6600 XT</option>
              </select>
            </div>

            {/* RAM Select */}
            <div className="input-group">
              <label className="block text-xs text-slate-500 mb-1.5 tracking-wider uppercase">
                {dict.game.ram}
              </label>
              <select
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e17] border border-[#1e293b] rounded-lg text-slate-300 text-sm outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="">选择内存大小...</option>
                <option>8 GB</option>
                <option>16 GB</option>
                <option>32 GB</option>
              </select>
            </div>

            {/* Check Button */}
            <div className="flex items-end">
              <button
                onClick={handleCheck}
                disabled={!canCheck}
                className={`w-full py-3 rounded-lg font-bold text-sm tracking-wider transition-all ${
                  canCheck
                    ? "bg-blue-500 text-[#0a0e17] hover:bg-blue-400 cursor-pointer"
                    : "bg-[#1a2233] text-slate-600 cursor-not-allowed"
                }`}
              >
                {dict.game.checkBtn}
              </button>
            </div>
          </div>

          {/* Result Preview */}
          {showResult && (
            <div className="mt-7 p-6 bg-[#0a0e17] rounded-lg border-l-3 border border-green-500 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center text-2xl flex-shrink-0">
                ✓
              </div>
              <div className="result-text">
                <h4 className="text-green-500 text-base mb-1">可以流畅运行！推荐中高画质</h4>
                <p className="text-slate-500 text-sm">
                  你的配置高于推荐需求。预计 1080p 中高画质下可稳定 50-60 FPS，建议关闭光线追踪。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
