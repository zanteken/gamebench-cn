"use client";

import { useState } from "react";
import { useSendFriendRequest, getMyMarkId } from "@/lib/useFriendRequests";
import type { Dictionary } from "@/i18n/dictionaries";

const CONTACT_TYPES_ZH = [
  { value: "wechat", label: "微信", icon: "💬", placeholder: "微信号" },
  { value: "qq", label: "QQ", icon: "🐧", placeholder: "QQ号" },
  { value: "steam", label: "Steam", icon: "🎮", placeholder: "Steam 好友代码" },
  { value: "discord", label: "Discord", icon: "🎧", placeholder: "用户名#1234" },
];

const CONTACT_TYPES_EN = [
  { value: "wechat", label: "WeChat", icon: "💬", placeholder: "WeChat ID" },
  { value: "qq", label: "QQ", icon: "🐧", placeholder: "QQ Number" },
  { value: "steam", label: "Steam", icon: "🎮", placeholder: "Steam Friend Code" },
  { value: "discord", label: "Discord", icon: "🎧", placeholder: "Username#1234" },
];

interface Props {
  targetMarkId: string;
  targetNickname: string;
  targetGpu: string;
  gameSlug: string;
  dict: Dictionary;
  locale?: string;
  onClose: () => void;
}

export default function SendFriendRequestDialog({
  targetMarkId, targetNickname, targetGpu, gameSlug, dict, locale = "zh", onClose,
}: Props) {
  const isEn = locale === "en";
  const d = dict.friends;
  const CONTACT_TYPES = isEn ? CONTACT_TYPES_EN : CONTACT_TYPES_ZH;

  const { send, sending, error, success, setError } = useSendFriendRequest();

  const [nickname, setNickname] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("gb_nickname") || "" : ""
  );
  const [contactType, setContactType] = useState("wechat");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const selectedType = CONTACT_TYPES.find((t) => t.value === contactType)!;

  const handleSend = async () => {
    if (!nickname.trim()) {
      setError(isEn ? "Please enter your nickname" : "请填写你的昵称");
      return;
    }
    if (!contact.trim()) {
      setError(isEn ? "Please enter your contact info" : "请填写联系方式");
      return;
    }

    const myMarkId = getMyMarkId(gameSlug);

    const ok = await send({
      to_mark_id: targetMarkId,
      from_nickname: nickname.trim(),
      from_contact: contact.trim(),
      from_contact_type: contactType as any,
      from_message: message.trim(),
      from_mark_id: myMarkId || undefined,
    });

    if (ok && typeof window !== "undefined") {
      localStorage.setItem("gb_nickname", nickname.trim());
    }
  };

  if (success) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🤝</div>
          <div className="text-base font-semibold text-white mb-1">
            {isEn ? "Request Sent!" : "请求已发送！"}
          </div>
          <p className="text-sm text-slate-400 mb-1">
            {isEn
              ? `Sent friend request to ${targetNickname}`
              : `已向 ${targetNickname} 发送好友请求`}
          </p>
          <p className="text-xs text-slate-600 mb-4">
            {isEn
              ? "They will see your request when they check their marks"
              : "对方下次查看印记时会看到你的请求和联系方式"}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500"
          >
            {isEn ? "OK" : "好的"}
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
          🤝
        </div>
        <div>
          <div className="text-sm font-semibold text-white">
            {isEn ? `Send friend request to ${targetNickname}` : `向 ${targetNickname} 发送好友请求`}
          </div>
          <div className="text-xs text-slate-600">{targetGpu}</div>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-3">
          {error}
        </div>
      )}

      {/* 你的昵称 */}
      <div className="mb-3">
        <label className="text-[11px] text-slate-600 mb-1 block">{d.yourNickname}</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={isEn ? "Your gaming nickname" : "你的游戏昵称"}
          maxLength={30}
          className="w-full px-3 py-2 rounded-lg text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-700 outline-none focus:border-blue-800"
        />
      </div>

      {/* 联系方式 */}
      <div className="mb-3">
        <label className="text-[11px] text-slate-600 mb-1 block">
          {d.yourContact} <span className="text-slate-700">({isEn ? "visible when accepted" : "对方接受后可见"})</span>
        </label>
        <div className="flex gap-2">
          {/* 平台选择 */}
          <div className="flex rounded-lg border border-slate-800 overflow-hidden">
            {CONTACT_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setContactType(t.value)}
                className={`px-2.5 py-2 text-xs transition-colors ${
                  contactType === t.value
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-600 hover:text-slate-400"
                }`}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={selectedType.placeholder}
            maxLength={50}
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-700 outline-none focus:border-blue-800"
          />
        </div>
      </div>

      {/* 附言 */}
      <div className="mb-4">
        <label className="text-[11px] text-slate-600 mb-1 block">{d.message}</label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isEn
            ? `E.g. I'm also using ${targetGpu}, let's compare settings?`
            : `比如: 我也是 ${targetGpu} 用户，交流一下设置？`}
          maxLength={200}
          className="w-full px-3 py-2 rounded-lg text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-700 outline-none focus:border-blue-800"
        />
      </div>

      {/* 隐私提示 */}
      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 mb-4">
        <div className="text-[11px] text-slate-500 leading-relaxed">
          🔒 {isEn
            ? `Your ${selectedType.label} contact info will be visible to the other player when they view your request. They can choose to share their contact info when accepting. Please do not share sensitive personal information.`
            : `你的 ${selectedType.label} 联系方式将在对方查看请求时可见。对方接受后可以选择回复自己的联系方式。请不要分享敏感个人信息。`}
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-300"
        >
          {dict.marks.cancel}
        </button>
        <button
          onClick={handleSend}
          disabled={sending || !nickname.trim() || !contact.trim()}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            !sending && nickname.trim() && contact.trim()
              ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              : "bg-slate-800 text-slate-600 cursor-not-allowed"
          }`}
        >
          {sending ? d.sending : `🤝 ${d.sendRequest}`}
        </button>
      </div>
    </Overlay>
  );
}

// ==================== 弹窗容器 ====================

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* 内容 */}
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
