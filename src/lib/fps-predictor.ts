/**
 * FPS 预测算法
 *
 * 原理：
 *   1. 每款游戏有「性能需求指数」= 推荐配置硬件的 benchmark 分数
 *   2. 用户硬件有「性能供给指数」= 用户 CPU/GPU 的 benchmark 分数
 *   3. FPS = f(供给/需求) × 分辨率系数 × 画质系数
 *
 * 准确度说明：
 *   - 冷启动阶段为算法预测，标注 ±20% 误差范围
 *   - 后续通过桌面端收集真实数据后逐步替换
 */

import cpuData from "@/../data/cpus.json";
import gpuData from "@/../data/gpus.json";

export interface HardwareItem {
  id: string;
  name: string;
  brand: string;
  score: number;
  tier: string;
  year: number;
}

export interface CPU extends HardwareItem {
  gen: string;
  cores: number;
  threads: number;
  baseClock: number;
  boostClock: number;
  tdp: number;
}

export interface GPU extends HardwareItem {
  series: string;
  vram: number;
}

export const cpus: CPU[] = cpuData as CPU[];
export const gpus: GPU[] = gpuData as GPU[];

// 分辨率对 GPU 负载的影响系数（以 1080p 为基准 1.0）
export const RESOLUTION_FACTORS: Record<string, { label: string; factor: number }> = {
  "720p":  { label: "1280×720 (HD)", factor: 0.56 },
  "1080p": { label: "1920×1080 (Full HD)", factor: 1.0 },
  "1440p": { label: "2560×1440 (2K)", factor: 1.78 },
  "4k":    { label: "3840×2160 (4K)", factor: 4.0 },
};

// 画质对 GPU 负载的影响系数（以"高"为基准 1.0）
export const QUALITY_FACTORS: Record<string, { label: string; factor: number }> = {
  "low":    { label: "低画质", factor: 0.5 },
  "medium": { label: "中画质", factor: 0.75 },
  "high":   { label: "高画质", factor: 1.0 },
  "ultra":  { label: "极高画质", factor: 1.35 },
};

// 游戏需求分数缓存（key: cpuText_gpuText_ram）
const gameDemandCache = new Map<string, { cpuDemand: number; gpuDemand: number; source: "recommended" | "minimum" | "estimated" }>();

/**
 * 从游戏的配置需求文本中匹配到硬件数据库的条目
 * 模糊匹配：比如游戏要求 "GTX 1060"，匹配到 gpus 列表中的 "GTX 1060 6GB"
 */
export function matchCPU(cpuText: string | null): CPU | null {
  if (!cpuText) return null;
  const text = cpuText.toLowerCase().replace(/[®™\-]/g, " ").replace(/\s+/g, " ");

  let bestMatch: CPU | null = null;
  let bestScore = 0;

  for (const cpu of cpus) {
    const name = cpu.name.toLowerCase().replace(/[®™\-]/g, " ").replace(/\s+/g, " ");
    // 提取关键部分（如 "i5 8400", "ryzen 5 5600x"）
    const idNorm = cpu.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    const textNorm = text.replace(/[^a-z0-9]/g, "");

    // 精确 ID 匹配
    if (textNorm.includes(idNorm)) {
      const matchLen = idNorm.length;
      if (matchLen > bestScore) {
        bestScore = matchLen;
        bestMatch = cpu;
      }
    }

    // 名称子串匹配
    const nameTokens = name.split(" ").filter((t) => t.length > 1);
    const matched = nameTokens.filter((t) => text.includes(t)).length;
    const score = matched / nameTokens.length;
    if (score > 0.6 && matched > bestScore) {
      bestScore = matched;
      bestMatch = cpu;
    }
  }

  return bestMatch;
}

export function matchGPU(gpuText: string | null): GPU | null {
  if (!gpuText) return null;
  const text = gpuText.toLowerCase().replace(/[®™\-]/g, " ").replace(/\s+/g, " ");

  let bestMatch: GPU | null = null;
  let bestScore = 0;

  for (const gpu of gpus) {
    const idNorm = gpu.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    const textNorm = text.replace(/[^a-z0-9]/g, "");

    if (textNorm.includes(idNorm)) {
      const matchLen = idNorm.length;
      if (matchLen > bestScore) {
        bestScore = matchLen;
        bestMatch = gpu;
      }
    }

    const name = gpu.name.toLowerCase().replace(/[®™\-]/g, " ").replace(/\s+/g, " ");
    const nameTokens = name.split(" ").filter((t) => t.length > 1);
    const matched = nameTokens.filter((t) => text.includes(t)).length;
    const score = matched / nameTokens.length;
    if (score > 0.6 && matched > bestScore) {
      bestScore = matched;
      bestMatch = gpu;
    }
  }

  return bestMatch;
}

/**
 * 估算游戏的「性能需求指数」
 * 基于推荐配置（如果有）或最低配置的硬件分数
 */
export function getGameDemandScore(game: {
  requirements: {
    minimum: { cpu: string | null; gpu: string | null; ram_gb: number | null };
    recommended: { cpu: string | null; gpu: string | null; ram_gb: number | null };
  };
}): { cpuDemand: number; gpuDemand: number; source: "recommended" | "minimum" | "estimated" } {
  // 优先用推荐配置
  const rec = game.requirements.recommended;
  const min = game.requirements.minimum;

  // 创建缓存键（使用配置要求字符串）
  const cacheKey = `${rec.cpu || ""}_${rec.gpu || ""}_${min.cpu || ""}_${min.gpu || ""}`;

  // 检查缓存
  if (gameDemandCache.has(cacheKey)) {
    return gameDemandCache.get(cacheKey)!;
  }

  const recCPU = matchCPU(rec.cpu);
  const recGPU = matchGPU(rec.gpu);
  const minCPU = matchCPU(min.cpu);
  const minGPU = matchGPU(min.gpu);

  let result: { cpuDemand: number; gpuDemand: number; source: "recommended" | "minimum" | "estimated" };

  if (recGPU) {
    result = {
      cpuDemand: recCPU?.score ?? (minCPU?.score ?? 30) * 1.4,
      gpuDemand: recGPU.score,
      source: "recommended",
    };
  } else if (minGPU) {
    // 推荐配置通常比最低高 40-60%
    result = {
      cpuDemand: (minCPU?.score ?? 20) * 1.5,
      gpuDemand: minGPU.score * 1.5,
      source: "minimum",
    };
  } else {
    // 都匹配不到，给一个默认值（假设中等需求）
    result = { cpuDemand: 30, gpuDemand: 30, source: "estimated" };
  }

  // 存入缓存
  gameDemandCache.set(cacheKey, result);
  return result;
}

export interface FPSPrediction {
  fps: number;
  fpsLow: number;      // 下限（-20%）
  fpsHigh: number;     // 上限（+20%）
  bottleneck: "cpu" | "gpu" | "balanced";
  canRunMin: boolean;   // 是否满足最低配置
  canRunRec: boolean;   // 是否满足推荐配置
  confidence: "high" | "medium" | "low";
  source: "recommended" | "minimum" | "estimated";
}

/**
 * 预测 FPS
 */
export function predictFPS(
  userCPU: CPU,
  userGPU: GPU,
  userRAM: number,
  game: {
    requirements: {
      minimum: { cpu: string | null; gpu: string | null; ram_gb: number | null };
      recommended: { cpu: string | null; gpu: string | null; ram_gb: number | null };
    };
  },
  resolution: string = "1080p",
  quality: string = "high"
): FPSPrediction {
  const demand = getGameDemandScore(game);

  const resFactor = RESOLUTION_FACTORS[resolution]?.factor ?? 1.0;
  const qualFactor = QUALITY_FACTORS[quality]?.factor ?? 1.0;

  // GPU FPS 贡献：GPU性能 / (游戏GPU需求 × 分辨率 × 画质)
  const effectiveGpuDemand = demand.gpuDemand * resFactor * qualFactor;
  const gpuRatio = userGPU.score / Math.max(effectiveGpuDemand, 1);

  // CPU FPS 贡献：CPU性能 / 游戏CPU需求（CPU受分辨率影响小）
  const cpuRatio = userCPU.score / Math.max(demand.cpuDemand, 1);

  // FPS 受限于 CPU 和 GPU 中的短板
  // 使用调和平均，偏向短板
  const ratio = Math.min(gpuRatio, cpuRatio);

  // 基准 FPS = 60（推荐配置在 1080p 高画质下通常约 60fps）
  const baseFPS = 60;
  let fps = Math.round(baseFPS * ratio);

  // 限制范围
  fps = Math.max(10, Math.min(300, fps));

  // RAM 惩罚
  const minRAM = game.requirements.minimum.ram_gb ?? 4;
  if (userRAM < minRAM) {
    fps = Math.round(fps * 0.6); // RAM 不足严重影响性能
  }

  // 瓶颈分析
  let bottleneck: "cpu" | "gpu" | "balanced";
  if (cpuRatio < gpuRatio * 0.8) {
    bottleneck = "cpu";
  } else if (gpuRatio < cpuRatio * 0.8) {
    bottleneck = "gpu";
  } else {
    bottleneck = "balanced";
  }

  // 配置达标判断
  const minCPU = matchCPU(game.requirements.minimum.cpu);
  const minGPU = matchGPU(game.requirements.minimum.gpu);
  const recCPU = matchCPU(game.requirements.recommended.cpu);
  const recGPU = matchGPU(game.requirements.recommended.gpu);

  const canRunMin =
    userCPU.score >= (minCPU?.score ?? 0) * 0.85 &&
    userGPU.score >= (minGPU?.score ?? 0) * 0.85;
  const canRunRec =
    userCPU.score >= (recCPU?.score ?? 999) * 0.85 &&
    userGPU.score >= (recGPU?.score ?? 999) * 0.85;

  // 置信度
  const confidence =
    demand.source === "recommended" ? "high" :
    demand.source === "minimum" ? "medium" : "low";

  return {
    fps,
    fpsLow: Math.max(10, Math.round(fps * 0.8)),
    fpsHigh: Math.min(300, Math.round(fps * 1.2)),
    bottleneck,
    canRunMin,
    canRunRec,
    confidence,
    source: demand.source,
  };
}
