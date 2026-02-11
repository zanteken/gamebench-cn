"use client";

import { useState, useEffect, useCallback } from "react";
import type { FriendRequest, CreateFriendRequestInput, UpdateFriendRequestInput } from "./types";

const STORAGE_PREFIX = "gb_marks_";

// ==================== Local Storage 管理 ====================

export function getMyToken(gameSlug: string): string | null {
  if (typeof window === "undefined") return null;
  const key = `${STORAGE_PREFIX}${gameSlug}`;
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    return data.token || null;
  } catch {
    return null;
  }
}

export function saveMyToken(gameSlug: string, token: string): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_PREFIX}${gameSlug}`;
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data.token = token;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    localStorage.setItem(key, JSON.stringify({ token }));
  }
}

export function getMyMarkId(gameSlug: string): string | null {
  if (typeof window === "undefined") return null;
  const key = `${STORAGE_PREFIX}${gameSlug}`;
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    return data.markId || null;
  } catch {
    return null;
  }
}

export function saveMyMarkId(gameSlug: string, markId: string): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_PREFIX}${gameSlug}`;
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data.markId = markId;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    localStorage.setItem(key, JSON.stringify({ markId }));
  }
}

// ==================== 好友请求 Hook ====================

export function useFriendRequests(markId: string | null, token: string | null) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!markId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/marks/friends?markId=${markId}&token=${token}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FriendRequest[] = await res.json();
      setRequests(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [markId, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const sendRequest = async (input: CreateFriendRequestInput): Promise<boolean> => {
    try {
      const res = await fetch("/api/marks/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        return false;
      }
      return true;
    } catch (e) {
      setError(String(e));
      return false;
    }
  };

  const respondToRequest = async (input: UpdateFriendRequestInput): Promise<boolean> => {
    try {
      const res = await fetch("/api/marks/friends", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `HTTP ${res.status}`);
        return false;
      }
      // 刷新列表
      await fetchRequests();
      return true;
    } catch (e) {
      setError(String(e));
      return false;
    }
  };

  return {
    requests,
    loading,
    error,
    sendRequest,
    respondToRequest,
    refresh: fetchRequests,
  };
}

// ==================== 我的好友请求数量 Hook ====================

export function usePendingRequestsCount(markId: string | null, token: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!markId || !token) return;
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/marks/friends?markId=${markId}&token=${token}`);
        if (res.ok) {
          const data: FriendRequest[] = await res.json();
          setCount(data.filter((r) => r.status === "pending").length);
        }
      } catch {
        // ignore
      }
    };
    fetchCount();
  }, [markId, token]);

  return count;
}

// ==================== 发送好友请求 Hook ====================

export function useSendFriendRequest() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = async (input: CreateFriendRequestInput): Promise<boolean> => {
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/marks/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();

      if (!res.ok) {
        // 翻译错误消息
        const errorMsg = translateError(data.error);
        setError(errorMsg);
        return false;
      }

      setSuccess(true);
      return true;
    } catch (e) {
      setError("网络错误，请稍后重试");
      return false;
    } finally {
      setSending(false);
    }
  };

  return { send, sending, error, success, setError };
}

// 错误消息翻译
function translateError(error: string): string {
  const errorMap: Record<string, { zh: string; en: string }> = {
    missing_required_fields: { zh: "请填写必要信息", en: "Please fill required fields" },
    mark_not_found: { zh: "印记不存在", en: "Mark not found" },
    not_looking_for_friends: { zh: "该玩家未开启交友", en: "Player not looking for friends" },
    cannot_add_self: { zh: "不能加自己为好友", en: "Cannot add yourself" },
    rate_limit_exceeded: { zh: "请求太频繁，请稍后再试", en: "Too many requests, please try again later" },
    already_sent: { zh: "你已经向这位玩家发过请求了", en: "You've already sent a request to this player" },
    feature_disabled: { zh: "功能暂未开放", en: "Feature not available" },
  };

  const locale = typeof window !== "undefined" && document.documentElement.lang.startsWith("en") ? "en" : "zh";
  return errorMap[error]?.[locale] || error;
}

// ==================== 我的好友请求 Hook ====================

export function useMyFriendRequests(markId: string | null, gameSlug: string) {
  const token = getMyToken(gameSlug);
  const { requests, loading, respondToRequest, refresh } = useFriendRequests(markId, token);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const respond = async (requestId: string, action: "accept" | "reject", contact?: string, contactType?: "wechat" | "qq" | "steam" | "discord", message?: string) => {
    return respondToRequest({ request_id: requestId, token: token!, action, to_contact: contact, to_contact_type: contactType, to_message: message });
  };

  return {
    requests,
    loading,
    pendingCount,
    respond,
    refresh,
  };
}
