import gamesData from "@/../data/games.json";
import { Game, GameCardData } from "./types";

// Type assertion — data is loaded at build time (SSG)
const games: Game[] = gamesData as Game[];

// Re-export types for convenience
export type { Game, GameCardData } from "./types";

/**
 * Genre 翻译映射（中文 → 英文）
 */
const GENRE_TRANSLATIONS: Record<string, string> = {
  "动作": "Action",
  "冒险": "Adventure",
  "角色扮演": "RPG",
  "策略": "Strategy",
  "模拟": "Simulation",
  "竞速": "Racing",
  "体育": "Sports",
  "休闲": "Casual",
  "独立": "Indie",
  "大型多人在线": "MMO",
  "免费开玩": "Free to Play",
  "抢先体验": "Early Access",
  "实用工具": "Utilities",
  "动画制作和建模": "Animation & Modeling",
  "照片编辑": "Photo Editing",
  "设计和插画": "Design & Illustration",
};

/**
 * 翻译 genre 标签
 */
export function translateGenre(genre: string, locale: string): string {
  if (locale === "en") {
    return GENRE_TRANSLATIONS[genre] || genre;
  }
  return genre;
}

/**
 * 翻译 genre 数组
 */
export function translateGenres(genres: string[], locale: string): string[] {
  return genres.map((g) => translateGenre(g, locale));
}

/**
 * 获取所有游戏（按热门度排序）
 */
export function getAllGames(): Game[] {
  return games;
}

/**
 * 获取首页列表用的精简数据（去掉详情页才需要的字段）
 */
export function getGamesForList(): GameCardData[] {
  return games.map((g) => ({
    appId: g.appId,
    name: g.name,
    slug: g.slug,
    isFree: g.isFree,
    headerImage: g.headerImage,
    genres: g.genres,
    price: g.price
      ? {
          initial: g.price.initial,
          final: g.price.final,
          discount_percent: g.price.discount_percent,
        }
      : null,
    recommendations: g.recommendations,
    minReq: {
      cpu: g.requirements.minimum.cpu,
      gpu: g.requirements.minimum.gpu,
      ram_gb: g.requirements.minimum.ram_gb,
    },
  }));
}

/**
 * 按 slug 获取单款游戏
 */
export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

/**
 * 获取所有 slug（用于 generateStaticParams）
 */
export function getAllSlugs(): string[] {
  return games.map((g) => g.slug);
}

/**
 * 按类型筛选游戏
 */
export function getGamesByGenre(genre: string): Game[] {
  return games.filter((g) => g.genres.includes(genre));
}

/**
 * 获取所有类型标签
 */
export function getAllGenres(): string[] {
  const genreSet = new Set<string>();
  games.forEach((g) => g.genres.forEach((genre) => genreSet.add(genre)));
  return Array.from(genreSet).sort();
}

/**
 * 格式化价格（分 → 元）
 */
export function formatPrice(
  price: { initial: number; final: number; discount_percent: number } | null,
  isFree: boolean,
  locale: string = "zh"
): string {
  if (isFree) return locale === "en" ? "Free" : "免费";
  if (!price) return locale === "en" ? "N/A" : "暂无价格";
  const yuan = price.final / 100;
  if (price.discount_percent > 0) {
    const original = price.initial / 100;
    if (locale === "en") {
      return `¥${yuan} (was ¥${original}, -${price.discount_percent}%)`;
    }
    return `¥${yuan} (原价 ¥${original}, -${price.discount_percent}%)`;
  }
  return `¥${yuan}`;
}

/**
 * 格式化推荐数
 */
export function formatRecommendations(count: number, locale: string = "zh"): string {
  if (count >= 10000) {
    const num = (count / 10000).toFixed(1);
    return locale === "en" ? `${(count / 1000).toFixed(0)}k` : `${num}万`;
  }
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
