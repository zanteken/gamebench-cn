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

// ==================== 玩家印记系统 ====================

export interface PlayerMark {
  id: string;
  game_app_id: number;
  game_slug: string;
  nickname: string;
  avatar: string;
  cpu: string;
  gpu: string;
  ram: string;
  fps_avg: number | null;
  fps_1_low: number | null;
  fps_01_low: number | null;
  resolution: string;
  quality: string;
  message: string;
  tags: string[];
  looking_for_friends: boolean;
  source: "manual" | "desktop_app" | "auto";
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export interface CreateMarkInput {
  game_app_id: number;
  game_slug: string;
  nickname: string;
  avatar?: string;
  cpu: string;
  gpu: string;
  ram?: string;
  fps_avg?: number;
  fps_1_low?: number;
  resolution?: string;
  quality?: string;
  message: string;
  tags?: string[];
  looking_for_friends?: boolean;
  source?: "manual" | "desktop_app";
}

export interface MarkReply {
  id: string;
  mark_id: string;
  nickname: string;
  avatar: string;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface CreateReplyInput {
  mark_id: string;
  nickname: string;
  avatar?: string;
  content: string;
}

export type SortType = "latest" | "popular" | "similar" | "friends";

export interface MarksQuery {
  gameSlug: string;
  sort?: SortType;
  gpu?: string;
  page?: number;
  limit?: number;
}

export interface FpsSessionUpload {
  game_app_id: number;
  cpu: string;
  gpu: string;
  ram_gb: number;
  os: string;
  fps_avg: number;
  fps_1_low: number;
  fps_01_low: number;
  fps_max: number;
  fps_min: number;
  total_frames: number;
  duration_secs: number;
  resolution: string;
  quality: string;
  fps_timeline: { elapsed_secs: number; fps: number; frametime_ms: number }[];
}

export interface MarksResponse {
  marks: PlayerMark[];
  total: number;
  stats: {
    avg_fps: number;
    mark_count: number;
    friends_count: number;
    gpu_distribution: { gpu: string; count: number }[];
    fps_distribution: { bucket: string; count: number }[];
  };
  myMarkId?: string;
}

// ==================== 好友请求系统 ====================

export interface FriendRequest {
  id: string;
  from_mark_id: string | null;
  from_nickname: string;
  from_avatar: string;
  from_contact: string;
  from_contact_type: "wechat" | "qq" | "steam" | "discord";
  from_message: string;
  to_mark_id: string;
  to_contact?: string;
  to_contact_type?: "wechat" | "qq" | "steam" | "discord";
  to_message?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  responded_at?: string;
}

export interface CreateFriendRequestInput {
  from_mark_id?: string;
  from_nickname: string;
  from_avatar?: string;
  from_contact: string;
  from_contact_type?: "wechat" | "qq" | "steam" | "discord";
  from_message?: string;
  to_mark_id: string;
}

export interface UpdateFriendRequestInput {
  request_id: string;
  token: string;
  action: "accept" | "reject";
  to_contact?: string;
  to_contact_type?: "wechat" | "qq" | "steam" | "discord";
  to_message?: string;
}
