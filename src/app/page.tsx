import { Metadata } from "next";
import { getGamesForList, getAllGenres } from "@/lib/games";
import GameListClient from "@/components/GameListClient";

export const metadata: Metadata = {
  title: "GameBench - PC游戏配置检测与FPS预测",
  description:
    "查看你的电脑能玩什么游戏，预测游戏FPS帧数，找到最值得升级的硬件。覆盖3,900+款PC游戏。",
};

export default function HomePage() {
  // 数据在服务端加载，只传精简字段给客户端
  const games = getGamesForList();
  const genres = getAllGenres();

  return (
    <div>
      {/* Hero Section — 服务端渲染，SEO 可见 */}
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          你的电脑能玩什么游戏？
        </h1>
        <p className="mx-auto max-w-2xl text-slate-400">
          查看 {games.length} 款热门 PC
          游戏的配置需求，预测你的电脑能跑多少帧
        </p>
      </section>

      {/* Stats bar — 服务端渲染 */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "游戏数据库", value: `${games.length}+`, icon: "🎮" },
          { label: "CPU 型号", value: "500+", icon: "⚡" },
          { label: "GPU 型号", value: "300+", icon: "🖥️" },
          { label: "FPS 测试数据", value: "建设中", icon: "📊" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#1a2233] p-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* 游戏列表 — 客户端组件处理搜索/筛选/分页 */}
      <GameListClient games={games} genres={genres} />
    </div>
  );
}
