"use client";

import { useState } from "react";
import { useMyFriendRequests, getMyToken } from "@/lib/useFriendRequests";
import type { FriendRequest } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  markId: string;
  gameSlug: string;
  dict: Dictionary;
  locale?: string;
  onClose: () => void;
}

export default function MyFriendRequestsPanel({ markId, gameSlug, dict, locale = "zh", onClose }: Props) {
  const isEn = locale === "en";
  const d = dict.friends;

  const { requests, loading, pendingCount, respond } = useMyFriendRequests(markId, gameSlug);

  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const rejected = requests.filter((r) => r.status === "rejected");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-800"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">📬</span>
          <h2 className="text-base font-semibold text-white">{d.myRequests}</h2>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400">
              {pendingCount} {isEn ? "pending" : "条待处理"}
            </span>
          )}
        </div>

        {loading && (
          <div className="text-center py-8 text-slate-600 text-sm">{dict.marks.loading}</div>
        )}

        {!loading && requests.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-slate-500">{d.noRequests}</p>
            <p className="text-xs text-slate-700 mt-1">
              {isEn
                ? "Other players can send you requests when they see your mark"
                : "其他玩家看到你的印记后可以向你发送请求"}
            </p>
          </div>
        )}

        {/* 待处理 */}
        {pending.length > 0 && (
          <Section title={isEn ? "Pending" : "待处理"} count={pending.length} locale={locale}>
            {pending.map((r) => (
              <PendingRequestCard
                key={r.id}
                request={r}
                dict={dict}
                locale={locale}
                onAccept={(contact, contactType, message) =>
                  respond(r.id, "accept", contact, contactType, message)
                }
                onReject={() => respond(r.id, "reject")}
              />
            ))}
          </Section>
        )}

        {/* 已接受 */}
        {accepted.length > 0 && (
          <Section title={d.accepted} count={accepted.length} locale={locale}>
            {accepted.map((r) => (
              <AcceptedRequestCard key={r.id} request={r} dict={dict} locale={locale} />
            ))}
          </Section>
        )}

        {/* 已拒绝 */}
        {rejected.length > 0 && (
          <Section title={d.rejected} count={rejected.length} locale={locale} collapsed>
            {rejected.map((r) => (
              <div key={r.id} className="flex items-center gap-2 py-2 text-sm text-slate-600">
                <span>{r.from_avatar}</span>
                <span>{r.from_nickname}</span>
                <span className="text-xs">— {d.rejected}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// ==================== 待处理卡片 ====================

function PendingRequestCard({
  request,
  dict,
  locale = "zh",
  onAccept,
  onReject,
}: {
  request: FriendRequest;
  dict: Dictionary;
  locale?: string;
  onAccept: (contact?: string, contactType?: "wechat" | "qq" | "steam" | "discord", message?: string) => Promise<boolean>;
  onReject: () => Promise<boolean>;
}) {
  const isEn = locale === "en";
  const d = dict.friends;

  const [showAccept, setShowAccept] = useState(false);
  const [myContact, setMyContact] = useState("");
  const [myContactType, setMyContactType] = useState(request.from_contact_type);
  const [myMessage, setMyMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const CONTACT_OPTIONS_ZH = [
    { value: "wechat", label: "微信" },
    { value: "qq", label: "QQ" },
    { value: "steam", label: "Steam" },
    { value: "discord", label: "Discord" },
  ];

  const CONTACT_OPTIONS_EN = [
    { value: "wechat", label: "WeChat" },
    { value: "qq", label: "QQ" },
    { value: "steam", label: "Steam" },
    { value: "discord", label: "Discord" },
  ];

  const CONTACT_OPTIONS = isEn ? CONTACT_OPTIONS_EN : CONTACT_OPTIONS_ZH;
  const CONTACT_LABELS = isEn
    ? { wechat: "WeChat", qq: "QQ", steam: "Steam", discord: "Discord" }
    : { wechat: "微信", qq: "QQ", steam: "Steam", discord: "Discord" };

  const handleAccept = async () => {
    setProcessing(true);
    const ok = await onAccept(
      myContact.trim() || undefined,
      myContact.trim() ? myContactType : undefined,
      myMessage.trim() || undefined
    );
    setProcessing(false);
    if (ok) setShowAccept(false);
  };

  const handleReject = async () => {
    setProcessing(true);
    await onReject();
    setProcessing(false);
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      {/* 发送方信息 */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-lg">
          {request.from_avatar}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{request.from_nickname}</div>
          <div className="text-[11px] text-slate-600">{getTimeAgo(request.created_at, locale)}</div>
        </div>
      </div>

      {/* 附言 */}
      {request.from_message && (
        <p className="text-sm text-slate-400 mb-3 pl-12">"{request.from_message}"</p>
      )}

      {/* 对方联系方式 */}
      <div className="flex items-center gap-2 mb-3 pl-12">
        <span className="text-xs text-slate-600">
          {CONTACT_LABELS[request.from_contact_type]}:
        </span>
        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-mono">
          {request.from_contact}
        </span>
      </div>

      {/* 操作按钮 */}
      {!showAccept ? (
        <div className="flex gap-2 pl-12">
          <button
            onClick={() => setShowAccept(true)}
            disabled={processing}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            ✓ {d.accept}
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {isEn ? "Ignore" : "忽略"}
          </button>
        </div>
      ) : (
        /* 接受时可以选择回复联系方式 */
        <div className="pl-12 space-y-2">
          <div className="text-[11px] text-emerald-400 mb-2">
            ✓ {isEn ? "Accept request - you can also reply with your contact info (optional)" : "接受请求 — 你也可以回复自己的联系方式（可选）"}
          </div>
          <div className="flex gap-2">
            <select
              value={myContactType}
              onChange={(e) => setMyContactType(e.target.value as any)}
              className="px-2 py-1.5 rounded-md text-xs bg-slate-950 border border-slate-800 text-white"
            >
              {CONTACT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              value={myContact}
              onChange={(e) => setMyContact(e.target.value)}
              placeholder={d.replyContact}
              className="flex-1 px-2 py-1.5 rounded-md text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-700 outline-none"
            />
          </div>
          <input
            value={myMessage}
            onChange={(e) => setMyMessage(e.target.value)}
            placeholder={d.replyMessagePlaceholder}
            className="w-full px-2 py-1.5 rounded-md text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-700 outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={processing}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {processing ? (isEn ? "Processing..." : "处理中...") : (isEn ? "Confirm" : "确认接受")}
            </button>
            <button
              onClick={() => setShowAccept(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-400"
            >
              {dict.marks.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 已接受卡片 ====================

function AcceptedRequestCard({ request, dict, locale = "zh" }: { request: FriendRequest; dict: Dictionary; locale?: string }) {
  const isEn = locale === "en";
  const CONTACT_LABELS = isEn
    ? { wechat: "WeChat", qq: "QQ", steam: "Steam", discord: "Discord" }
    : { wechat: "微信", qq: "QQ", steam: "Steam", discord: "Discord" };

  return (
    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{request.from_avatar}</span>
        <span className="text-sm font-medium text-white">{request.from_nickname}</span>
        <span className="text-[10px] text-emerald-500">✓ {dict.friends.accepted}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-600">
          {isEn ? "Their" : "对方"} {CONTACT_LABELS[request.from_contact_type]}:
        </span>
        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
          {request.from_contact}
        </span>
      </div>
      {request.from_message && (
        <p className="text-xs text-slate-500 mt-1">"{request.from_message}"</p>
      )}
    </div>
  );
}

// ==================== 辅助 ====================

function Section({
  title, count, collapsed, locale = "zh", children,
}: {
  title: string; count: number; collapsed?: boolean; locale?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!collapsed);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-2 text-xs text-slate-500 hover:text-slate-300"
      >
        <span>{open ? "▾" : "▸"}</span>
        <span>{title}</span>
        <span className="text-slate-700">({count})</span>
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
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
    return `${days}d ago`;
  } else {
    if (mins < 1) return "刚刚";
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  }
}
