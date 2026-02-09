import gamesData from "@/../data/games.json";
import { Game } from "./types";

// Type assertion — data is loaded at build time (SSG)
const games: Game[] = gamesData as Game[];

// Re-export Game type for convenience
export type { Game } from "./types";

/**
 * 获取所有游戏（按热门度排序）
 */
export function getAllGames(): Game[] {
  return games;
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
export function formatPrice(price: Game["price"], isFree: boolean): string {
  if (isFree) return "免费";
  if (!price) return "暂无价格";
  const yuan = price.final / 100;
  if (price.discount_percent > 0) {
    const original = price.initial / 100;
    return `¥${yuan} (原价 ¥${original}, -${price.discount_percent}%)`;
  }
  return `¥${yuan}`;
}

/**
 * 格式化推荐数
 */
export function formatRecommendations(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}
