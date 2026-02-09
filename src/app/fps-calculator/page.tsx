import { Metadata } from "next";
import { getAllGames } from "@/lib/games";
import FPSCalculatorClient from "./FPSCalculatorClient";

export const metadata: Metadata = {
  title: "FPS计算器 - 预测你的电脑能跑多少帧",
  description:
    "输入你的CPU和显卡型号，预测5000+款PC游戏的FPS帧数。支持1080p/2K/4K分辨率和不同画质预设。",
  keywords: ["FPS计算器", "帧数预测", "配置检测", "显卡测试", "CPU性能"],
};

export default function FPSCalculatorPage() {
  const allGames = getAllGames();
  const gamesForCalc = allGames.map((g) => ({
    appId: g.appId,
    name: g.name,
    slug: g.slug,
    headerImage: g.headerImage,
    genres: g.genres,
    requirements: g.requirements,
  }));

  return <FPSCalculatorClient games={gamesForCalc} />;
}
