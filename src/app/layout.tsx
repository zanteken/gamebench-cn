import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "GameBench CN - PC游戏配置检测与FPS预测",
    template: "%s | GameBench CN",
  },
  description:
    "查看你的电脑能玩什么游戏，预测游戏FPS帧数，找到最值得升级的硬件。覆盖100,000+款PC游戏。",
  keywords: ["PC游戏", "配置检测", "FPS预测", "系统要求", "显卡", "处理器"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="border-t border-[#1e293b] py-8 mt-12">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
            <p>GameBench CN — 中国首个PC游戏性能检测平台</p>
            <p className="mt-1">
              游戏数据来源：Steam | 配置检测基于算法预测（持续优化中）
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
