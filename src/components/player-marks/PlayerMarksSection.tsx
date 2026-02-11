"use client";

import { useState } from "react";
import { usePlayerMarks } from "@/lib/usePlayerMarks";
import MarkCard from "./MarkCard";
import PostMarkForm from "./PostMarkForm";
import FpsDistribution from "./FpsDistribution";
import type { SortType } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

interface Props {
  gameSlug: string;
  gameAppId: number;
  gameName: string;
  locale?: string;
  dict: Dictionary;
}

export default function PlayerMarksSection({
  gameSlug,
  gameAppId,
  gameName,
  locale = "zh",
  dict,
}: Props) {
  const isEn = locale === "en";
  const d = dict.marks;

  const {
    marks, total, stats, loading, error,
    sort, setSort, postMark, refresh, updateMarkRepliesCount,
  } = usePlayerMarks(gameSlug);

  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const SORT_OPTIONS: { key: SortType; label: string; icon?: string }[] = [
    { key: "latest", label: d.sortLatest },
    { key: "popular", label: d.sortPopular },
    { key: "similar", label: d.sortSimilar },
    { key: "friends", label: d.sortFriends, icon: "👋" },
  ];

  return (
    <section className="mt-10 border-t border-[#1e293b] pt-8">
      {/* Slogan */}
      <div className="text-center mb-6">
        <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-br from-blue-600/5 to-emerald-600/5 border border-blue-500/10">
          <p className="text-lg font-semibold text-white">
            {d.slogan}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {d.sloganDesc}
          </p>
        </div>
      </div>

      {/* 统计栏 */}
      {stats && stats.mark_count > 0 && (
        <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-500">
          <span>{stats.mark_count} {d.statsMarks}</span>
          <span>·</span>
          <span>{d.statsAvg} {stats.avg_fps} {d.avgFPS}</span>
          <span>·</span>
          <span>{stats.friends_count} {d.statsFriends}</span>
        </div>
      )}

      {/* FPS 分布 */}
      {stats && stats.fps_distribution && (
        <FpsDistribution
          distribution={stats.fps_distribution}
          gpuDistribution={stats.gpu_distribution}
          dict={dict}
        />
      )}

      {/* 工具栏 */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sort === opt.key
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showForm
              ? "bg-[#1a2233] text-slate-400"
              : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
          }`}
        >
          {showForm ? d.cancel : `✍️ ${d.leaveMark}`}
        </button>
      </div>

      {/* 发布表单 */}
      {showForm && (
        <PostMarkForm
          gameSlug={gameSlug}
          gameAppId={gameAppId}
          gameName={gameName}
          locale={locale}
          onSubmit={async (input) => {
            const result = await postMark(input);
            if (result) {
              setShowForm(false);
              return true;
            }
            return false;
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 加载状态 */}
      {loading && marks.length === 0 && (
        <div className="text-center py-12 text-slate-600 text-sm">
          {d.loading}
        </div>
      )}

      {/* 错误 */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* 空状态 */}
      {!loading && marks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🎮</div>
          <p className="text-slate-400 text-sm">{d.noMarks}</p>
          <p className="text-slate-600 text-xs mt-1">
            {isEn
              ? `Be the first to share your ${gameName} experience`
              : `成为第一个分享 ${gameName} 体验的人`}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500"
            >
              {d.leaveMark}
            </button>
          )}
        </div>
      )}

      {/* 印记列表 */}
      <div className="space-y-3">
        {marks.map((mark) => (
          <MarkCard
            key={mark.id}
            mark={mark}
            gameSlug={gameSlug}
            dict={dict}
            locale={locale}
            expanded={expandedId === mark.id}
            onToggleExpand={() =>
              setExpandedId(expandedId === mark.id ? null : mark.id)
            }
            onReplyPosted={(markId, newCount) => updateMarkRepliesCount(markId, newCount)}
          />
        ))}
      </div>

      {/* 分页 */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <span className="text-xs text-slate-600">
            {isEn
              ? `Showing ${marks.length} / ${total} marks`
              : `显示 ${marks.length} / ${total} 条印记`}
          </span>
        </div>
      )}
    </section>
  );
}
