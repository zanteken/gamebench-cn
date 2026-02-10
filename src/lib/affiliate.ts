/**
 * 多语言导购链接
 * 中文 → 京东
 * 英文 → Amazon
 */

import type { Locale } from "@/i18n/dictionaries";

// TODO: 注册后填入
const JD_UNION_ID = "";
const AMAZON_AFFILIATE_TAG = "";  // 例如 "gamebencher-20"

/**
 * 根据语言生成购物链接
 */
export function getShopLink(keyword: string, locale: Locale): string {
  if (locale === "en") {
    return getAmazonLink(keyword);
  }
  return getJDLink(keyword);
}

export function getHardwareShopLink(
  type: "cpu" | "gpu" | "ram" | "ssd",
  keyword: string,
  locale: Locale
): string {
  if (locale === "en") {
    const prefixes = { cpu: "processor ", gpu: "graphics card ", ram: "RAM ", ssd: "SSD " };
    return getAmazonLink(prefixes[type] + keyword);
  }
  const prefixes = { cpu: "处理器 ", gpu: "显卡 ", ram: "内存条 ", ssd: "固态硬盘 " };
  return getJDLink(prefixes[type] + keyword);
}

// ── 京东 ──

function getJDLink(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  if (JD_UNION_ID) {
    return `https://union-click.jd.com/jdc?e=&p=JF8BAM4JK1olXg4HUF5aCk8RA18IGloRXQYBVW4ZVxNJXF9RXh5UHw0cSgYYXBcIWDoXSQVJQwYBXF5dC04SAm4JGlsSQl9HCANtAXV3ej9dUD1lB2dDOBdrF1sLajtUbV9eD0seM28PHFoSXgEDVlhdOHsnM2w4RTUcWAQDVUhVAXtcMw&keyword=${encoded}`;
  }
  return `https://search.jd.com/Search?keyword=${encoded}&enc=utf-8`;
}

// ── Amazon ──

function getAmazonLink(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  const tag = AMAZON_AFFILIATE_TAG ? `&tag=${AMAZON_AFFILIATE_TAG}` : "";
  return `https://www.amazon.com/s?k=${encoded}${tag}`;
}

// ── 升级推荐 ──

import type { CPU, GPU } from "./fps-predictor";

export interface UpgradeProduct {
  name: string;
  reason: string;
  reasonEn: string;
  priceZh: string;
  priceEn: string;
  tier: "budget" | "value" | "premium";
}

export interface UpgradeRecommendation {
  type: "cpu" | "gpu" | "ram";
  priority: "high" | "medium" | "low";
  reasonZh: string;
  reasonEn: string;
  currentLevel: string;
  products: UpgradeProduct[];
}

function gpuUpgrades(gpu: GPU): UpgradeProduct[] {
  const s = gpu.score;
  if (s < 20) return [
    { name: "RTX 4060", reason: "主流甜品卡，1080p通吃", reasonEn: "Mainstream pick, handles 1080p smoothly", priceZh: "¥2300-2600", priceEn: "$289-329", tier: "budget" },
    { name: "RTX 4060 Ti", reason: "中高端首选，2K流畅", reasonEn: "Great for 1440p gaming", priceZh: "¥2800-3200", priceEn: "$389-429", tier: "value" },
    { name: "RX 7700 XT", reason: "A卡性价比之选", reasonEn: "Best AMD value for 1440p", priceZh: "¥2500-2900", priceEn: "$419-459", tier: "value" },
  ];
  if (s < 40) return [
    { name: "RTX 4060 Ti", reason: "稳定2K高画质", reasonEn: "Solid 1440p performance", priceZh: "¥2800-3200", priceEn: "$389-429", tier: "budget" },
    { name: "RTX 4070 SUPER", reason: "2K极致体验", reasonEn: "Premium 1440p experience", priceZh: "¥4000-4500", priceEn: "$579-629", tier: "value" },
    { name: "RX 7800 XT", reason: "A卡2K旗舰性价比", reasonEn: "AMD flagship value", priceZh: "¥3500-3900", priceEn: "$479-529", tier: "value" },
  ];
  if (s < 60) return [
    { name: "RTX 4070 SUPER", reason: "2K畅玩，光追出色", reasonEn: "Excellent ray tracing, great at 1440p", priceZh: "¥4000-4500", priceEn: "$579-629", tier: "budget" },
    { name: "RTX 4070 Ti SUPER", reason: "准4K体验", reasonEn: "Near-4K capable", priceZh: "¥5500-6200", priceEn: "$779-849", tier: "value" },
    { name: "RTX 4080 SUPER", reason: "4K高画质首选", reasonEn: "4K gaming ready", priceZh: "¥7500-8500", priceEn: "$979-1049", tier: "premium" },
  ];
  return [
    { name: "RTX 4080 SUPER", reason: "4K流畅", reasonEn: "Smooth 4K gaming", priceZh: "¥7500-8500", priceEn: "$979-1049", tier: "value" },
    { name: "RTX 4090", reason: "当前最强", reasonEn: "The absolute best", priceZh: "¥13000-16000", priceEn: "$1549-1799", tier: "premium" },
  ];
}

function cpuUpgrades(cpu: CPU): UpgradeProduct[] {
  const s = cpu.score;
  if (s < 30) return [
    { name: "i5-12400F", reason: "性价比之王", reasonEn: "Best budget choice", priceZh: "¥700-850", priceEn: "$109-139", tier: "budget" },
    { name: "R5 5600", reason: "AM4平台首选", reasonEn: "Best AM4 value", priceZh: "¥600-750", priceEn: "$99-129", tier: "budget" },
    { name: "i5-13600KF", reason: "14核强悍", reasonEn: "Powerful 14 cores", priceZh: "¥1500-1800", priceEn: "$249-289", tier: "value" },
  ];
  if (s < 55) return [
    { name: "i5-14600KF", reason: "主流游戏最佳", reasonEn: "Best mainstream gaming", priceZh: "¥1600-2000", priceEn: "$279-319", tier: "budget" },
    { name: "R7 7800X3D", reason: "游戏性能之王", reasonEn: "Gaming performance king", priceZh: "¥2500-2900", priceEn: "$359-419", tier: "value" },
    { name: "i7-14700KF", reason: "全能旗舰", reasonEn: "All-round flagship", priceZh: "¥2600-3000", priceEn: "$369-419", tier: "premium" },
  ];
  return [
    { name: "R7 7800X3D", reason: "游戏帧数巅峰", reasonEn: "Peak gaming FPS", priceZh: "¥2500-2900", priceEn: "$359-419", tier: "value" },
    { name: "i9-14900K", reason: "Intel旗舰", reasonEn: "Intel flagship", priceZh: "¥3500-4200", priceEn: "$539-599", tier: "premium" },
  ];
}

export function getUpgradeRecommendations(
  cpu: CPU, gpu: GPU, ram: number, bottleneck: "cpu" | "gpu" | "balanced"
): UpgradeRecommendation[] {
  const recs: UpgradeRecommendation[] = [];

  if (bottleneck === "gpu" || bottleneck === "balanced") {
    recs.push({
      type: "gpu", priority: bottleneck === "gpu" ? "high" : "medium",
      reasonZh: bottleneck === "gpu" ? "显卡是当前最大瓶颈，升级后提升最明显" : "升级显卡可获得更好体验",
      reasonEn: bottleneck === "gpu" ? "GPU is the main bottleneck, upgrading gives the biggest boost" : "A GPU upgrade will improve your experience",
      currentLevel: `${gpu.name} (${gpu.score}/100)`,
      products: gpuUpgrades(gpu),
    });
  }

  if (bottleneck === "cpu" || bottleneck === "balanced") {
    recs.push({
      type: "cpu", priority: bottleneck === "cpu" ? "high" : "medium",
      reasonZh: bottleneck === "cpu" ? "处理器是当前最大瓶颈" : "升级处理器可减少帧数波动",
      reasonEn: bottleneck === "cpu" ? "CPU is the main bottleneck" : "A CPU upgrade will reduce frame drops",
      currentLevel: `${cpu.name} (${cpu.score}/100)`,
      products: cpuUpgrades(cpu),
    });
  }

  if (ram < 16) {
    recs.push({
      type: "ram", priority: ram <= 8 ? "high" : "medium",
      reasonZh: `${ram}GB内存不足，建议升级到16GB+`,
      reasonEn: `${ram}GB RAM is insufficient, 16GB+ recommended`,
      currentLevel: `${ram}GB`,
      products: [
        { name: "DDR4 16GB (8G×2)", reason: "双通道性能更好", reasonEn: "Dual channel for better performance", priceZh: "¥200-300", priceEn: "$39-59", tier: "budget" },
        { name: "DDR5 32GB (16G×2)", reason: "新平台首选", reasonEn: "Best for new platforms", priceZh: "¥500-700", priceEn: "$69-99", tier: "value" },
      ],
    });
  }

  return recs;
}
