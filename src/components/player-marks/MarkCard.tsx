"use client";

import { useState, useEffect } from "react";
import { useReplies } from "@/lib/usePlayerMarks";
import { getMyMarkId, getMyToken } from "@/lib/useFriendRequests";
import SendFriendRequestDialog from "./SendFriendRequestDialog";
import MyFriendRequestsPanel from "./MyFriendRequestsPanel";
import type { PlayerMark } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  mark: PlayerMark;
  gameSlug: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onLike: () => void;
  dict: Dictionary;
  locale?: string;
}

// 获取浏览器指纹
function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("gb_fingerprint");
  if (!fp) {
    fp = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("gb_fingerprint", fp);
  }
  return fp;
}

export default function MarkCard({ mark, gameSlug, expanded, onToggleExpand, onLike, dict, locale = "zh" }: Props) {
  const [liked, setLiked] = useState(false);
  const [showFriendDialog, setShowFriendDialog] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

  const d = dict.marks;
  const fpsColor = getFpsColor(mark.fps_avg || 0);
  const timeAgo = getTimeAgo(mark.created_at, locale);
  const isEn = locale === "en";

  // 判断是否是"我的印记"
  const myMarkId = getMyMarkId(gameSlug);
  const isMine = myMarkId === mark.id;

  // 检查是否已点赞
  useEffect(() => {
    const checkLiked = async () => {
      const fp = getFingerprint();
      if (!fp) return;
      try {
        const res = await fetch(`/api/marks/likes?mark_id=${mark.id}&fingerprint=${fp}`);
        const data = await res.json();
        setLiked(data.liked || false);
      } catch {
        // ignore
      }
    };
    checkLiked();
  }, [mark.id]);

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  const d = dict.marks;
  const fpsColor = getFpsColor(mark.fps_avg || 0);
  const timeAgo = getTimeAgo(mark.created_at, locale);
  const isEn = locale === "en";

  // 判断是否是"我的印记"
  const myMarkId = getMyMarkId(gameSlug);
  const isMine = myMarkId === mark.id;

  const handleLike = () => {
    setLiked(!liked);
    onLike();
  };

  return (
    <>
      <div
        className={`rounded-xl overflow-hidden transition-colors ${
          isMine
            ? "bg-blue-950/30 border border-blue-800/30"
            : "bg-[#1a2233] border border-[#1e293b] hover:border-blue-900/40"
        }`}
      >
        <div className="p-4 sm:p-5">
          {/* 头部 */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1e293b] to-[#1a2233] flex items-center justify-center text-lg">
                {mark.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-200">{mark.nickname}</span>
                  {isMine && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/15 text-blue-400 border border-blue-500/20">
                      {d.myMark}
                    </span>
                  )}
                  {mark.looking_for_friends && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      👋 {d.wantFriends}
                    </span>
                  )}
                  {mark.source === "desktop_app" && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/15">
                      {d.fromDesktop}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">{timeAgo}</div>
              </div>
            </div>

            {/* 右上角: FPS 徽章 或 好友请求通知 */}
            <div className="flex items-center gap-2">
              {/* 我的印记: 好友请求通知 */}
              {isMine && (mark as any).pending_requests_count > 0 && (
                <button
                  onClick={() => setShowMyRequests(true)}
                  className="relative px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                >
                  <span className="text-sm">📬</span>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {(mark as any).pending_requests_count}
                  </span>
                </button>
              )}

              {/* 我的印记但没通知: 查看请求入口 */}
              {isMine && !((mark as any).pending_requests_count > 0) && (
                <button
                  onClick={() => setShowMyRequests(true)}
                  className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-slate-400 hover:bg-slate-800/50 transition-colors"
                  title={isEn ? "View friend requests" : "查看好友请求"}
                >
                  <span className="text-sm">📬</span>
                </button>
              )}

              {/* FPS 徽章 */}
              {mark.fps_avg && (
                <div
                  className="text-right px-3 py-1 rounded-lg"
                  style={{ background: `${fpsColor}10`, border: `1px solid ${fpsColor}30` }}
                >
                  <div className="text-xl font-extrabold leading-none" style={{ color: fpsColor }}>
                    {Math.round(mark.fps_avg)}
                  </div>
                  <div className="text-[9px] text-slate-600 mt-0.5">AVG FPS</div>
                </div>
              )}
            </div>
          </div>

          {/* 配置条 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mark.gpu && <ConfigPill icon="🖥" text={mark.gpu} />}
            {mark.cpu && <ConfigPill icon="⚡" text={mark.cpu} />}
            {mark.ram && <ConfigPill icon="💾" text={mark.ram} />}
            <ConfigPill icon="📺" text={`${mark.resolution} · ${mark.quality}`} />
          </div>

          {/* FPS 细节 */}
          {mark.fps_avg && (
            <div className="flex gap-5 px-3 py-2 rounded-lg bg-[#0a0e17]/50 mb-3 text-xs">
              <div>
                <span className="text-slate-600">{d.avgFpsLabel}</span>
                <span className="ml-1 font-bold" style={{ color: fpsColor }}>{mark.fps_avg}</span>
              </div>
              {mark.fps_1_low && (
                <div>
                  <span className="text-slate-600">{d.low1Percent}</span>
                  <span className="ml-1 font-bold" style={{ color: getFpsColor(mark.fps_1_low) }}>
                    {mark.fps_1_low}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-600">{d.resolution}</span>
                <span className="ml-1 text-slate-400">{mark.resolution}</span>
              </div>
              <div>
                <span className="text-slate-600">{d.quality}</span>
                <span className="ml-1 text-slate-400">{mark.quality}</span>
              </div>
            </div>
          )}

          {/* 留言 */}
          <p className="text-[13.5px] leading-relaxed text-slate-300 mb-2">
            {mark.message}
          </p>

          {/* 标签 */}
          {mark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {mark.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-blue-500/8 text-blue-400 border border-blue-500/12"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 操作栏 */}
          <div className="flex items-center gap-4 pt-3 border-t border-[#1e293b]/60">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                liked ? "bg-red-500/10 text-red-400" : "text-slate-600 hover:text-slate-400"
              }`}
            >
              {liked ? "❤️" : "🤍"} {mark.likes_count || 0}
            </button>
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-600 hover:text-slate-400"
            >
              {d.replies} {mark.replies_count || 0}
            </button>

            {/* 加为好友按钮 (不是自己的印记 + 对方开启了交友) */}
            {!isMine && mark.looking_for_friends && (
              <button
                onClick={() => setShowFriendDialog(true)}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/8 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors"
              >
                🤝 {d.addFriend}
              </button>
            )}
          </div>

          {/* 回复区 */}
          {expanded && <RepliesSection markId={mark.id} locale={locale} dict={dict} />}
        </div>
      </div>

      {/* 好友请求弹窗 */}
      {showFriendDialog && (
        <SendFriendRequestDialog
          targetMarkId={mark.id}
          targetNickname={mark.nickname}
          targetGpu={mark.gpu}
          gameSlug={gameSlug}
          dict={dict}
          locale={locale}
          onClose={() => setShowFriendDialog(false)}
        />
      )}

      {/* 我的好友请求面板 */}
      {showMyRequests && isMine && (
        <MyFriendRequestsPanel
          markId={mark.id}
          gameSlug={gameSlug}
          dict={dict}
          locale={locale}
          onClose={() => setShowMyRequests(false)}
        />
      )}
    </>
  );
}

// ==================== 回复区 ====================

interface RepliesSectionProps {
  markId: string;
  locale: string;
  dict: Dictionary;
}

function RepliesSection({ markId, locale, dict }: RepliesSectionProps) {
  const d = dict.marks;
  const { replies, loading, postReply } = useReplies(markId);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("gb_nickname") || "" : ""
  );

  const handleSubmit = async () => {
    if (!content.trim() || !nickname.trim()) return;
    const result = await postReply({
      mark_id: markId,
      nickname: nickname.trim(),
      content: content.trim(),
    });
    if (result) {
      setContent("");
      if (typeof window !== "undefined") {
        localStorage.setItem("gb_nickname", nickname.trim());
      }
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#1e293b]/40">
      {loading && <div className="text-xs text-slate-600 py-2">{d.loadingReplies}</div>}

      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-2 py-2">
          <span className="text-sm">{reply.avatar}</span>
          <div className="flex-1">
            <span className="text-xs font-medium text-slate-400">{reply.nickname}</span>
            <span className="text-[10px] text-slate-700 ml-2">{getTimeAgo(reply.created_at, locale)}</span>
            <p className="text-xs text-slate-400 mt-0.5">{reply.content}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        {!nickname && (
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={d.nickname}
            className="w-20 px-2 py-1.5 rounded-md text-xs bg-[#0a0e17] border border-[#1e293b] text-white outline-none"
          />
        )}
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={d.saySomething}
          className="flex-1 px-3 py-1.5 rounded-md text-xs bg-[#0a0e17] border border-[#1e293b] text-white outline-none focus:border-blue-600"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-3 py-1.5 rounded-md text-xs bg-blue-600 text-white disabled:opacity-40"
        >
          {d.send}
        </button>
      </div>
    </div>
  );
}

// ==================== 辅助 ====================

function ConfigPill({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-[#1e293b]/60 text-slate-400 border border-[#1a2233]/50 whitespace-nowrap">
      {icon} {text}
    </span>
  );
}

function getFpsColor(fps: number): string {
  if (fps >= 60) return "#22c55e";
  if (fps >= 30) return "#f59e0b";
  return "#ef4444";
}

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
