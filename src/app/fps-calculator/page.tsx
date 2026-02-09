import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FPS 计算器 - 预测你的游戏帧数",
  description:
    "输入你的 CPU 和 GPU，预测各款游戏的 FPS 帧数。支持不同分辨率和画质设置。",
};

export default function FPSCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <div className="mb-6 text-6xl">🔧</div>
      <h1 className="mb-4 text-3xl font-bold text-white">FPS 计算器</h1>
      <p className="mb-2 text-slate-400">
        输入你的 CPU 和 GPU，预测各款游戏的 FPS 帧数
      </p>
      <p className="text-slate-500 text-sm">该功能正在开发中，敬请期待</p>

      {/* Preview of what it will look like */}
      <div className="mt-8 rounded-xl border border-[#1e293b] bg-[#1a2233] p-6">
        <div className="mb-4 space-y-3">
          <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3 text-left">
            <label className="mb-1 block text-xs text-slate-500">
              选择 CPU
            </label>
            <div className="text-sm text-slate-600">
              例如：Intel Core i5-12400, AMD Ryzen 5 5600X...
            </div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3 text-left">
            <label className="mb-1 block text-xs text-slate-500">
              选择 GPU
            </label>
            <div className="text-sm text-slate-600">
              例如：NVIDIA GeForce RTX 3060, AMD Radeon RX 6700 XT...
            </div>
          </div>
          <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-3 text-left">
            <label className="mb-1 block text-xs text-slate-500">内存</label>
            <div className="text-sm text-slate-600">16 GB DDR4</div>
          </div>
        </div>

        <button
          disabled
          className="w-full rounded-lg bg-brand-600/50 py-3 text-sm font-medium text-brand-300 cursor-not-allowed"
        >
          计算 FPS（即将推出）
        </button>
      </div>
    </div>
  );
}
