/**
 * 京东联盟链接 + 硬件升级推荐
 *
 * 京东联盟计划：
 *   注册地址: https://union.jd.com
 *   佣金比例: 电脑硬件通常 0.5%~2%
 *   链接格式: https://union-click.jd.com/jdc?e=...
 *
 * 冷启动阶段用搜索链接（不需要对接商品API），
 * 后续升级为精准商品链接提高转化。
 */

// TODO: 注册京东联盟后填入你的推广ID
const JD_UNION_ID = "";  // 例如 "1234567890"

/**
 * 生成京东搜索链接
 * 冷启动方案：直接搜索关键词，不需要对接商品API
 */
export function getJDSearchLink(keyword: string): string {
  const encoded = encodeURIComponent(keyword);

  if (JD_UNION_ID) {
    // 有联盟ID时用联盟跳转链接
    return `https://union-click.jd.com/jdc?e=&p=JF8BAM4JK1olXg4HUF5aCk8RA18IGloRXQYBVW4ZVxNJXF9RXh5UHw0cSgYYXBcIWDoXSQVJQwYBXF5dC04SAm4JGlsSQl9HCANtAXV3ej9dUD1lB2dDOBdrF1sLajtUbV9eD0seM28PHFoSXgEDVlhdOHsnM2w4RTUcWAQDVUhVAXtcMw&keyword=${encoded}`;
  }

  // 没有联盟ID时用普通搜索链接
  return `https://search.jd.com/Search?keyword=${encoded}&enc=utf-8`;
}

/**
 * 生成特定品类的京东链接
 */
export function getJDCategoryLink(
  type: "cpu" | "gpu" | "ram" | "ssd",
  keyword: string
): string {
  const categoryMap = {
    cpu: "处理器 " + keyword,
    gpu: "显卡 " + keyword,
    ram: "内存条 " + keyword,
    ssd: "固态硬盘 " + keyword,
  };
  return getJDSearchLink(categoryMap[type]);
}

/**
 * 升级推荐逻辑
 *
 * 根据用户当前配置的瓶颈，推荐最佳升级方案
 */
export interface UpgradeRecommendation {
  type: "cpu" | "gpu" | "ram";
  priority: "high" | "medium" | "low";
  reason: string;
  currentLevel: string;
  suggestedProducts: {
    name: string;
    reason: string;
    priceRange: string;
    jdLink: string;
    tier: "budget" | "value" | "premium";
  }[];
}

import type { CPU, GPU } from "./fps-predictor";

/**
 * 根据瓶颈推荐 GPU 升级
 */
function suggestGPUUpgrades(currentGPU: GPU): UpgradeRecommendation["suggestedProducts"] {
  const score = currentGPU.score;

  // 根据当前显卡水平推荐3个档次
  if (score < 20) {
    // 入门卡用户
    return [
      { name: "RTX 4060", reason: "主流甜品卡，1080p通吃", priceRange: "¥2300-2600", jdLink: getJDSearchLink("RTX 4060 显卡"), tier: "budget" },
      { name: "RTX 4060 Ti", reason: "中高端首选，2K流畅", priceRange: "¥2800-3200", jdLink: getJDSearchLink("RTX 4060 Ti 显卡"), tier: "value" },
      { name: "RX 7700 XT", reason: "A卡性价比之选，2K流畅", priceRange: "¥2500-2900", jdLink: getJDSearchLink("RX 7700 XT 显卡"), tier: "value" },
    ];
  } else if (score < 40) {
    // 中低端用户
    return [
      { name: "RTX 4060 Ti", reason: "稳定2K高画质", priceRange: "¥2800-3200", jdLink: getJDSearchLink("RTX 4060 Ti 显卡"), tier: "budget" },
      { name: "RTX 4070 SUPER", reason: "2K极致体验", priceRange: "¥4000-4500", jdLink: getJDSearchLink("RTX 4070 SUPER 显卡"), tier: "value" },
      { name: "RX 7800 XT", reason: "A卡2K旗舰性价比", priceRange: "¥3500-3900", jdLink: getJDSearchLink("RX 7800 XT 显卡"), tier: "value" },
    ];
  } else if (score < 60) {
    // 中端用户
    return [
      { name: "RTX 4070 SUPER", reason: "2K畅玩，光追出色", priceRange: "¥4000-4500", jdLink: getJDSearchLink("RTX 4070 SUPER 显卡"), tier: "budget" },
      { name: "RTX 4070 Ti SUPER", reason: "准4K体验", priceRange: "¥5500-6200", jdLink: getJDSearchLink("RTX 4070 Ti SUPER 显卡"), tier: "value" },
      { name: "RTX 4080 SUPER", reason: "4K高画质首选", priceRange: "¥7500-8500", jdLink: getJDSearchLink("RTX 4080 SUPER 显卡"), tier: "premium" },
    ];
  } else {
    // 高端用户
    return [
      { name: "RTX 4080 SUPER", reason: "4K流畅，光追极致", priceRange: "¥7500-8500", jdLink: getJDSearchLink("RTX 4080 SUPER 显卡"), tier: "value" },
      { name: "RTX 4090", reason: "当前最强，4K无压力", priceRange: "¥13000-16000", jdLink: getJDSearchLink("RTX 4090 显卡"), tier: "premium" },
    ];
  }
}

/**
 * 根据瓶颈推荐 CPU 升级
 */
function suggestCPUUpgrades(currentCPU: CPU): UpgradeRecommendation["suggestedProducts"] {
  const score = currentCPU.score;

  if (score < 30) {
    return [
      { name: "i5-12400F", reason: "性价比之王，6核够用", priceRange: "¥700-850", jdLink: getJDSearchLink("i5-12400F 处理器"), tier: "budget" },
      { name: "R5 5600", reason: "AM4平台最佳选择", priceRange: "¥600-750", jdLink: getJDSearchLink("锐龙5 5600 处理器"), tier: "budget" },
      { name: "i5-13600KF", reason: "14核强悍性能", priceRange: "¥1500-1800", jdLink: getJDSearchLink("i5-13600KF 处理器"), tier: "value" },
    ];
  } else if (score < 55) {
    return [
      { name: "i5-14600KF", reason: "主流游戏最佳选择", priceRange: "¥1600-2000", jdLink: getJDSearchLink("i5-14600KF 处理器"), tier: "budget" },
      { name: "R7 7800X3D", reason: "游戏性能之王", priceRange: "¥2500-2900", jdLink: getJDSearchLink("锐龙7 7800X3D 处理器"), tier: "value" },
      { name: "i7-14700KF", reason: "全能旗舰", priceRange: "¥2600-3000", jdLink: getJDSearchLink("i7-14700KF 处理器"), tier: "premium" },
    ];
  } else {
    return [
      { name: "R7 7800X3D", reason: "游戏帧数巅峰", priceRange: "¥2500-2900", jdLink: getJDSearchLink("锐龙7 7800X3D 处理器"), tier: "value" },
      { name: "i9-14900K", reason: "Intel旗舰，多线程碾压", priceRange: "¥3500-4200", jdLink: getJDSearchLink("i9-14900K 处理器"), tier: "premium" },
      { name: "R9 7950X3D", reason: "游戏+生产力双巅峰", priceRange: "¥4000-4800", jdLink: getJDSearchLink("锐龙9 7950X3D 处理器"), tier: "premium" },
    ];
  }
}

/**
 * 生成完整升级建议
 */
export function getUpgradeRecommendations(
  cpu: CPU,
  gpu: GPU,
  ram: number,
  bottleneck: "cpu" | "gpu" | "balanced"
): UpgradeRecommendation[] {
  const recommendations: UpgradeRecommendation[] = [];

  // GPU 推荐
  if (bottleneck === "gpu" || bottleneck === "balanced") {
    recommendations.push({
      type: "gpu",
      priority: bottleneck === "gpu" ? "high" : "medium",
      reason: bottleneck === "gpu"
        ? "显卡是当前最大瓶颈，升级后提升最明显"
        : "升级显卡可以获得更好的游戏体验",
      currentLevel: `${gpu.name}（性能评分 ${gpu.score}/100）`,
      suggestedProducts: suggestGPUUpgrades(gpu),
    });
  }

  // CPU 推荐
  if (bottleneck === "cpu" || bottleneck === "balanced") {
    recommendations.push({
      type: "cpu",
      priority: bottleneck === "cpu" ? "high" : "medium",
      reason: bottleneck === "cpu"
        ? "处理器是当前最大瓶颈，升级后帧数提升明显"
        : "升级处理器可以减少帧数波动",
      currentLevel: `${cpu.name}（性能评分 ${cpu.score}/100）`,
      suggestedProducts: suggestCPUUpgrades(cpu),
    });
  }

  // RAM 推荐
  if (ram < 16) {
    recommendations.push({
      type: "ram",
      priority: ram <= 8 ? "high" : "medium",
      reason: ram <= 8
        ? "8GB内存在2024年已严重不足，很多大作最低要求16GB"
        : "升级到16GB可以避免内存不足导致的卡顿",
      currentLevel: `${ram}GB`,
      suggestedProducts: [
        { name: "DDR4 16GB (8G×2)", reason: "双通道性能更好", priceRange: "¥200-300", jdLink: getJDSearchLink("DDR4 8G×2 内存条"), tier: "budget" },
        { name: "DDR5 32GB (16G×2)", reason: "新平台首选", priceRange: "¥500-700", jdLink: getJDSearchLink("DDR5 16G×2 内存条"), tier: "value" },
      ],
    });
  }

  return recommendations;
}
