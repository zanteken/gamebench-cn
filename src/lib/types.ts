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
  slug: string;
  type: string;
  isFree: boolean;
  headerImage: string;
  developers: string[];
  publishers: string[];
  genres: string[];
  categories: string[];
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
