export interface Requirements {
  cpu: string | null;
  gpu: string | null;
  ram_gb: number | null;
  storage: string | null;
  directx: string | null;
}

export interface GamePrice {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
}

export interface Game {
  appId: number;
  name: string;
  nameEn?: string;  // 英文名称（可选）
  slug: string;
  type: string;
  isFree: boolean;
  headerImage: string;
  developers: string[];
  publishers: string[];
  genres: string[];
  genresEn?: string[];  // 英文 genre（可选）
  categories: string[];
  contentDescriptors?: string[];  // 内容描述符（暴力、血腥等）
  contentDescriptorsEn?: string[];  // 英文内容描述符
  releaseDate: string;
  comingSoon: boolean;
  platforms: { windows?: boolean; mac?: boolean; linux?: boolean };
  price: GamePrice | null;
  metacritic: { score: number; url: string } | null;
  recommendations: number;
  requirements: {
    minimum: Requirements;
    recommended: Requirements;
  };
}

/**
 * 首页列表用的精简数据（只保留卡片展示所需字段）
 * 完整 Game 约 4.4MB，GameCardData 约 1.7MB，减少 62%
 */
export interface GameCardData {
  appId: number;
  name: string;
  nameEn?: string;  // 英文名称（可选）
  slug: string;
  isFree: boolean;
  headerImage: string;
  genres: string[];
  genresEn?: string[];  // 英文 genre（可选）
  contentDescriptors?: string[];
  contentDescriptorsEn?: string[];
  price: { initial: number; final: number; discount_percent: number } | null;
  recommendations: number;
  minReq: {
    cpu: string | null;
    gpu: string | null;
    ram_gb: number | null;
  };
}
