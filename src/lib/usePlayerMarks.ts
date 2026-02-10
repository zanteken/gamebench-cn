"use client";

import { useState, useEffect, useCallback } from "react";
import type { PlayerMark, MarksResponse, MarkReply, SortType, CreateMarkInput, CreateReplyInput } from "./types";

const API_BASE = "/api/marks";

// ==================== 浏览器指纹 (匿名，用于防刷) ====================

function getFingerprint(): string {
  if (typeof window === "undefined") return "ssr";
  const stored = localStorage.getItem("gb_fp");
  if (stored) return stored;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx?.fillText("GameBench", 10, 10);
  const canvasData = canvas.toDataURL();

  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    canvasData.slice(0, 50),
  ].join("|");

  // 简单哈希
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  const fp = "fp_" + Math.abs(hash).toString(36);
  localStorage.setItem("gb_fp", fp);
  return fp;
}

// ==================== 主 Hook ====================

export function usePlayerMarks(gameSlug: string) {
  const [marks, setMarks] = useState<PlayerMark[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<MarksResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortType>("latest");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchMarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        slug: gameSlug,
        sort,
        page: String(page),
        limit: "20",
      });
      const res = await fetch(`${API_BASE}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MarksResponse = await res.json();
      setMarks(data.marks);
      setTotal(data.total);
      setStats(data.stats);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [gameSlug, sort, page]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  // 发布印记
  const postMark = async (input: CreateMarkInput): Promise<PlayerMark | null> => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const mark: PlayerMark = await res.json();
      setMarks((prev) => [mark, ...prev]);
      setTotal((prev) => prev + 1);
      return mark;
    } catch (e) {
      setError(String(e));
      return null;
    }
  };

  // 点赞
  const toggleLike = async (markId: string): Promise<boolean> => {
    const fp = getFingerprint();
    try {
      const res = await fetch(`${API_BASE}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark_id: markId, fingerprint: fp }),
      });
      const { liked } = await res.json();
      setMarks((prev) =>
        prev.map((m) =>
          m.id === markId
            ? { ...m, likes_count: m.likes_count + (liked ? 1 : -1) }
            : m
        )
      );
      return liked;
    } catch {
      return false;
    }
  };

  return {
    marks, total, stats, loading, error,
    sort, setSort,
    page, setPage,
    postMark, toggleLike,
    refresh: fetchMarks,
  };
}

// ==================== 回复 Hook ====================

export function useReplies(markId: string | null) {
  const [replies, setReplies] = useState<MarkReply[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!markId) return;
    setLoading(true);
    fetch(`${API_BASE}/replies?markId=${markId}`)
      .then((r) => r.json())
      .then(setReplies)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [markId]);

  const postReply = async (input: CreateReplyInput): Promise<MarkReply | null> => {
    try {
      const res = await fetch(`${API_BASE}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const reply: MarkReply = await res.json();
      setReplies((prev) => [...prev, reply]);
      return reply;
    } catch {
      return null;
    }
  };

  return { replies, loading, postReply };
}
