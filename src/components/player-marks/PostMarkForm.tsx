"use client";

import { useState } from "react";
import type { CreateMarkInput } from "@/lib/types";
import { isSupabaseEnabled } from "@/lib/supabase";

const PRESET_TAGS_ZH = [
  "合作", "攻略交流", "同配置", "求优化", "找队友",
  "直播", "AMD", "NVIDIA", "笔记本", "4K",
];

const PRESET_TAGS_EN = [
  "Co-op", "Tips", "Similar Build", "Optimization", "LFG",
  "Streaming", "AMD", "NVIDIA", "Laptop", "4K",
];

const AVATARS = ["🎮", "🕹️", "🏆", "⚔️", "🛡️", "🔮", "🎯", "🚀", "🐉", "👾", "🤖", "🦊"];

const QUALITY_OPTIONS_ZH = ["低", "中", "高", "极高", "自定义"];
const QUALITY_OPTIONS_EN = ["Low", "Medium", "High", "Ultra", "Custom"];

const RESOLUTION_OPTIONS = [
  { value: "1920x1080", label: "1080p" },
  { value: "2560x1440", label: "2K" },
  { value: "3840x2160", label: "4K" },
  { value: "1280x720", label: "720p" },
];

interface Props {
  gameSlug: string;
  gameAppId: number;
  gameName: string;
  locale?: string;
  onSubmit: (input: CreateMarkInput) => Promise<boolean>;
  onCancel: () => void;
  prefill?: {
    cpu?: string;
    gpu?: string;
    ram?: string;
    fps_avg?: number;
    fps_1_low?: number;
  };
}

// 通用时间函数
function getTimeAgo(dateStr: string, locale: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (locale === "en") {
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } else {
    if (mins < 1) return "刚刚";
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}天前`;
    return `${Math.floor(days / 30)}个月前`;
  }
}

export default function PostMarkForm({
  gameSlug,
  gameAppId,
  gameName,
  locale = "zh",
  onSubmit,
  onCancel,
  prefill,
}: Props) {
  const isEn = locale === "en";
  const PRESET_TAGS = isEn ? PRESET_TAGS_EN : PRESET_TAGS_ZH;
  const QUALITY_OPTIONS = isEn ? QUALITY_OPTIONS_EN : QUALITY_OPTIONS_ZH;

  const [nickname, setNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("gb_nickname") || "" : ""
  );
  const [avatar, setAvatar] = useState(() =>
    AVATARS[Math.floor(Math.random() * AVATARS.length)]
  );
  const [showAvatars, setShowAvatars] = useState(false);
  const [gpu, setGpu] = useState(prefill?.gpu || "");
  const [cpu, setCpu] = useState(prefill?.cpu || "");
  const [ram, setRam] = useState(prefill?.ram || "");
  const [fpsAvg, setFpsAvg] = useState(prefill?.fps_avg?.toString() || "");
  const [fps1Low, setFps1Low] = useState(prefill?.fps_1_low?.toString() || "");
  const [resolution, setResolution] = useState("1920x1080");
  const [quality, setQuality] = useState(isEn ? "Medium" : "中");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lookingForFriends, setLookingForFriends] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 3)
    );
  };

  const canSubmit = nickname.trim() && gpu.trim() && message.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // 检查 Supabase 是否配置
    if (!isSupabaseEnabled()) {
      setError(isEn ? "Feature not available" : "功能暂未开放");
      return;
    }

    setSubmitting(true);
    setError(null);

    if (typeof window !== "undefined") {
      localStorage.setItem("gb_nickname", nickname.trim());
    }

    const input: CreateMarkInput = {
      game_app_id: gameAppId,
      game_slug: gameSlug,
      nickname: nickname.trim(),
      avatar,
      cpu: cpu.trim(),
      gpu: gpu.trim(),
      ram: ram.trim(),
      fps_avg: fpsAvg ? parseFloat(fpsAvg) : undefined,
      fps_1_low: fps1Low ? parseFloat(fps1Low) : undefined,
      resolution,
      quality,
      message: message.trim(),
      tags,
      looking_for_friends: lookingForFriends,
      source: prefill ? "desktop_app" : "manual",
    };

    const ok = await onSubmit(input);
    setSubmitting(false);
    if (!ok) {
      setError(isEn ? "Failed to post" : "发布失败，请稍后重试");
    }
  };

  const labels = {
    nickname: isEn ? "Nickname" : "昵称",
    gpu: isEn ? "GPU *" : "显卡 *",
    cpu: isEn ? "CPU" : "处理器",
    ram: isEn ? "RAM" : "内存",
    fpsAvg: isEn ? "Avg FPS" : "平均 FPS",
    fps1Low: isEn ? "1% Low" : "1% Low",
    resolution: isEn ? "Resolution" : "分辨率",
    quality: isEn ? "Quality" : "画质",
    message: isEn ? "Message" : "留言",
    messagePlaceholder: isEn
      ? "Share your experience, optimization tips, or find players..."
      : "分享你的游戏体验、优化心得，或者就想找人一起玩...",
    tags: isEn ? "Tags (max 3)" : "标签（最多3个）",
    lookingForFriends: isEn ? "Looking for friends" : "我想交朋友",
    lookingForFriendsDesc: isEn
      ? "Other players can send you friend requests"
      : "开启后其他玩家可以向你发送好友请求",
    cancel: isEn ? "Cancel" : "取消",
    submit: submitting ? (isEn ? "Posting..." : "发布中...") : (isEn ? "Leave Mark ✨" : "留下印记 ✨"),
    header: isEn ? `Leave your mark on ${gameName}` : `在 ${gameName} 留下你的印记`,
    messageLimit: isEn ? "({count}/500)" : "({count}/500)",
  };

  return (
    <div className="rounded-xl bg-[#1a2233] border border-blue-500/15 p-5 mb-4">
      <div className="text-sm font-semibold text-white mb-4">
        ✍️ {labels.header}
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-3">
          {error}
        </div>
      )}

      {/* 昵称 + 头像 */}
      <div className="flex gap-3 mb-3">
        <div className="relative">
          <button
            onClick={() => setShowAvatars(!showAvatars)}
            className="w-10 h-10 rounded-lg bg-[#111827] border border-[#1e293b] text-lg flex items-center justify-center hover:border-slate-600"
          >
            {avatar}
          </button>
          {showAvatars && (
            <div className="absolute top-12 left-0 z-10 grid grid-cols-6 gap-1 p-2 rounded-lg bg-[#1a2233] border border-[#1e293b] shadow-xl">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAvatar(a); setShowAvatars(false); }}
                  className={`w-8 h-8 rounded flex items-center justify-center hover:bg-[#111827] ${
                    avatar === a ? "bg-blue-600/20 ring-1 ring-blue-500" : ""
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.nickname} *</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={isEn ? "Your nickname" : "你的游戏昵称"}
            maxLength={30}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* 硬件配置 */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.gpu}</label>
          <input
            value={gpu}
            onChange={(e) => setGpu(e.target.value)}
            placeholder={isEn ? "e.g. RTX 4060" : "如 RTX 4060"}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.cpu}</label>
          <input
            value={cpu}
            onChange={(e) => setCpu(e.target.value)}
            placeholder={isEn ? "e.g. i5-12400" : "如 i5-12400"}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* FPS + 设置 */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.fpsAvg}</label>
          <input
            value={fpsAvg}
            onChange={(e) => setFpsAvg(e.target.value)}
            placeholder="72"
            type="number"
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.fps1Low}</label>
          <input
            value={fps1Low}
            onChange={(e) => setFps1Low(e.target.value)}
            placeholder="55"
            type="number"
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.resolution}</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white outline-none cursor-pointer"
          >
            {RESOLUTION_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] text-slate-600 mb-1 block">{labels.quality}</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white outline-none cursor-pointer"
          >
            {QUALITY_OPTIONS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 留言 */}
      <div className="mb-3">
        <label className="text-[11px] text-slate-600 mb-1 block">
          {labels.message} * <span className="text-slate-700">{labels.messageLimit.replace("{count}", String(message.length))}</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={labels.messagePlaceholder}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0e17] border border-[#1e293b] text-white placeholder-slate-700 outline-none focus:border-blue-600 resize-y leading-relaxed"
        />
      </div>

      {/* 标签 */}
      <div className="mb-3">
        <label className="text-[11px] text-slate-600 mb-1.5 block">{labels.tags}</label>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                tags.includes(tag)
                  ? "bg-blue-600/15 border-blue-500/25 text-blue-400"
                  : "border-[#1e293b] text-slate-600 hover:text-slate-400"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 想交朋友开关 */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg mb-4 border transition-colors ${
          lookingForFriends
            ? "bg-emerald-500/5 border-emerald-500/15"
            : "bg-[#0a0e17] border-[#1e293b]"
        }`}
      >
        <div>
          <div className={`text-sm font-medium ${lookingForFriends ? "text-emerald-400" : "text-slate-500"}`}>
            👋 {labels.lookingForFriends}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            {labels.lookingForFriendsDesc}
          </div>
        </div>
        <button
          onClick={() => setLookingForFriends(!lookingForFriends)}
          className="relative w-11 h-6 rounded-full transition-colors"
          style={{ background: lookingForFriends ? "#10b981" : "#334155" }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: lookingForFriends ? 24 : 4 }}
          />
        </button>
      </div>

      {/* 提交按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          {labels.cancel}
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            canSubmit
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
              : "bg-[#1a2233] text-slate-600 cursor-not-allowed"
          }`}
        >
          {labels.submit}
        </button>
      </div>
    </div>
  );
}
