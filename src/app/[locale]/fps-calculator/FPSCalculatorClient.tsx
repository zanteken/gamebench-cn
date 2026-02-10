"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  cpus, gpus, RESOLUTION_FACTORS, QUALITY_FACTORS,
  predictFPS, type CPU, type GPU, type FPSPrediction,
} from "@/lib/fps-predictor";
import type { Locale, Dictionary } from "@/i18n/dictionaries";
import { t } from "@/i18n/dictionaries";
import UpgradePanel from "@/components/UpgradePanel";

type GameForCalc = {
  appId: number; name: string; slug: string; headerImage: string;
  genres: string[];
  requirements: {
    minimum: { cpu: string | null; gpu: string | null; ram_gb: number | null };
    recommended: { cpu: string | null; gpu: string | null; ram_gb: number | null };
  };
};

/* ── Searchable Dropdown ── */
function SearchSelect<T extends { id: string; name: string }>({
  items, value, onChange, placeholder, renderItem,
}: {
  items: T[]; value: T | null; onChange: (item: T | null) => void;
  placeholder: string; renderItem?: (item: T) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 50);
    const q = query.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 50);
  }, [items, query]);

  return (
    <div className="relative">
      <input type="text"
        value={open ? query : value?.name ?? ""}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange(null); }}
        onFocus={() => { setOpen(true); setQuery(""); }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#2a3548] bg-[#111827] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
      />
      {value && !open && (
        <button onClick={() => { onChange(null); setQuery(""); setOpen(true); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">✕</button>
      )}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[#2a3548] bg-[#131c2e] shadow-2xl">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">No results</div>
            ) : filtered.map((item) => (
              <button key={item.id} onClick={() => { onChange(item); setOpen(false); setQuery(""); }}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-300 transition hover:bg-blue-600/20 hover:text-white">
                {renderItem ? renderItem(item) : item.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function fpsColor(fps: number) {
  return fps >= 120 ? "text-emerald-400" : fps >= 60 ? "text-lime-400" : fps >= 30 ? "text-yellow-400" : "text-red-400";
}
function fpsBgColor(fps: number) {
  return fps >= 120 ? "bg-emerald-500" : fps >= 60 ? "bg-lime-500" : fps >= 30 ? "bg-yellow-500" : "bg-red-500";
}

function GameRow({ game, prediction, locale, dict }: { game: GameForCalc; prediction: FPSPrediction; locale: Locale; dict: Dictionary }) {
  const statusLabel = prediction.canRunRec ? dict.fps.statusRec : prediction.canRunMin ? dict.fps.statusMin : dict.fps.statusBelow;
  const statusCls = prediction.canRunRec ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : prediction.canRunMin ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#131c2e] px-3 py-2.5 transition hover:border-[#2a3548]">
      <Link href={`/${locale}/game/${game.slug}`} className="hidden sm:block shrink-0">
        <img src={game.headerImage} alt={game.name} className="h-10 w-20 rounded object-cover bg-[#111827]" loading="lazy" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/${locale}/game/${game.slug}`} className="block truncate text-sm text-white hover:text-blue-400 transition">{game.name}</Link>
        <div className="mt-0.5 flex items-center gap-2">
          <span className={`rounded-full border px-1.5 py-px text-[10px] font-medium ${statusCls}`}>{statusLabel}</span>
          {prediction.bottleneck !== "balanced" && (
            <span className="text-[10px] text-slate-600">{dict.fps.bottleneck}: {prediction.bottleneck.toUpperCase()}</span>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-3 w-40">
        <div className="flex-1 h-2 rounded-full bg-[#1e293b] overflow-hidden">
          <div className={`h-full rounded-full ${fpsBgColor(prediction.fps)} transition-all`}
            style={{ width: `${Math.min(prediction.fps / 144 * 100, 100)}%` }} />
        </div>
        <span className={`w-12 text-right text-sm font-bold tabular-nums ${fpsColor(prediction.fps)}`}>{prediction.fps}</span>
      </div>
    </div>
  );
}

const qualityKeys = ["low", "medium", "high", "ultra"] as const;

export default function FPSCalculatorClient({
  games, locale, dict,
}: {
  games: GameForCalc[]; locale: Locale; dict: Dictionary;
}) {
  const [cpu, setCpu] = useState<CPU | null>(null);
  const [gpu, setGpu] = useState<GPU | null>(null);
  const [ram, setRam] = useState(16);
  const [res, setRes] = useState("1080p");
  const [qual, setQual] = useState("high");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"fps-desc" | "fps-asc" | "name">("fps-desc");
  const ready = cpu && gpu;

  const qualityLabels: Record<string, string> = {
    low: dict.fps.qualityLow, medium: dict.fps.qualityMed,
    high: dict.fps.qualityHigh, ultra: dict.fps.qualityUltra,
  };

  const predictions = useMemo(() => {
    if (!ready) return [];
    return games.map((g) => ({ game: g, pred: predictFPS(cpu, gpu, ram, g, res, qual) }));
  }, [cpu, gpu, ram, res, qual, ready, games]);

  const displayed = useMemo(() => {
    let list = predictions;
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter((p) => p.game.name.toLowerCase().includes(q)); }
    return [...list].sort((a, b) => sortBy === "fps-desc" ? b.pred.fps - a.pred.fps : sortBy === "fps-asc" ? a.pred.fps - b.pred.fps : a.game.name.localeCompare(b.game.name));
  }, [predictions, search, sortBy]);

  const stats = useMemo(() => {
    if (!predictions.length) return null;
    return {
      avg: Math.round(predictions.reduce((s, p) => s + p.pred.fps, 0) / predictions.length),
      fps60: predictions.filter((p) => p.pred.fps >= 60).length,
      fps30: predictions.filter((p) => p.pred.fps >= 30).length,
      total: predictions.length,
    };
  }, [predictions]);

  // Determine overall bottleneck
  const overallBottleneck = useMemo(() => {
    if (!predictions.length) return "balanced" as const;
    const gpuCount = predictions.filter((p) => p.pred.bottleneck === "gpu").length;
    return gpuCount > predictions.length * 0.5 ? "gpu" as const : "cpu" as const;
  }, [predictions]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{dict.fps.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{t(dict.fps.subtitle, { count: games.length.toLocaleString() })}</p>
      </div>

      {/* Config Panel */}
      <div className="mb-8 rounded-xl border border-[#1e293b] bg-[#0f1825] p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">{dict.fps.labelCPU}</label>
            <SearchSelect items={cpus} value={cpu} onChange={setCpu} placeholder={dict.fps.selectCPU}
              renderItem={(c) => <span>{c.name}<span className="ml-2 text-xs text-slate-500">{c.cores}C {c.boostClock}GHz</span></span>} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">{dict.fps.labelGPU}</label>
            <SearchSelect items={gpus} value={gpu} onChange={setGpu} placeholder={dict.fps.selectGPU}
              renderItem={(g) => <span>{g.name}<span className="ml-2 text-xs text-slate-500">{g.vram}GB</span></span>} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">{dict.fps.labelRAM}</label>
            <select value={ram} onChange={(e) => setRam(Number(e.target.value))}
              className="w-full rounded-lg border border-[#2a3548] bg-[#111827] px-4 py-3 text-sm text-white outline-none focus:border-blue-500">
              {[4, 8, 12, 16, 24, 32, 64].map((v) => <option key={v} value={v}>{v} GB</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">{dict.fps.labelRes}</label>
            <div className="flex gap-1.5">
              {Object.keys(RESOLUTION_FACTORS).map((key) => (
                <button key={key} onClick={() => setRes(key)}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition ${res === key ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#111827] text-slate-400 hover:bg-[#1a2540] hover:text-white"}`}>
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">{dict.fps.labelQuality}</label>
            <div className="flex gap-1.5">
              {qualityKeys.map((key) => (
                <button key={key} onClick={() => setQual(key)}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition ${qual === key ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#111827] text-slate-400 hover:bg-[#1a2540] hover:text-white"}`}>
                  {qualityLabels[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
        {ready && (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#1e293b] pt-3 text-xs text-slate-500">
            <span className="rounded bg-blue-500/10 px-2 py-1 text-blue-400">{cpu.name}</span>
            <span>+</span>
            <span className="rounded bg-green-500/10 px-2 py-1 text-green-400">{gpu.name}</span>
            <span>+</span>
            <span className="rounded bg-[#111827] px-2 py-1">{ram}GB</span>
            <span className="ml-auto rounded bg-[#111827] px-2 py-1">{res.toUpperCase()} · {qualityLabels[qual]}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {!ready ? (
        <div className="rounded-xl border border-dashed border-[#2a3548] py-20 text-center">
          <div className="mb-3 text-5xl opacity-40">🖥️</div>
          <p className="text-lg text-slate-400">{dict.fps.placeholder}</p>
          <p className="mt-1 text-sm text-slate-600">{t(dict.fps.placeholderSub, { cpuCount: cpus.length, gpuCount: gpus.length })}</p>
        </div>
      ) : (
        <>
          {stats && (
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { val: stats.avg, label: dict.fps.avgFPS, color: fpsColor(stats.avg) },
                { val: stats.fps60, label: dict.fps.over60, color: "text-lime-400" },
                { val: stats.fps30, label: dict.fps.playable, color: "text-yellow-400" },
                { val: stats.total, label: dict.fps.totalGames, color: "text-slate-300" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-[#1e293b] bg-[#0f1825] p-3 text-center">
                  <div className={`text-xl font-bold tabular-nums ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Upgrade Panel */}
          {cpu && gpu && (
            <UpgradePanel cpu={cpu} gpu={gpu} ram={ram} bottleneck={overallBottleneck} locale={locale} dict={dict} />
          )}

          {/* Search + Sort */}
          <div className="mb-3 mt-6 flex gap-2">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={dict.fps.searchGame}
              className="flex-1 rounded-lg border border-[#2a3548] bg-[#111827] px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-[#2a3548] bg-[#111827] px-3 py-2 text-xs text-slate-300 outline-none">
              <option value="fps-desc">{dict.fps.sortFPSDesc}</option>
              <option value="fps-asc">{dict.fps.sortFPSAsc}</option>
              <option value="name">{dict.fps.sortName}</option>
            </select>
          </div>

          <div className="mb-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-400/80">
            {dict.fps.disclaimer}
          </div>

          <div className="space-y-1.5">
            {displayed.slice(0, 150).map(({ game, pred }) => (
              <GameRow key={game.appId} game={game} prediction={pred} locale={locale} dict={dict} />
            ))}
          </div>
          {displayed.length > 150 && (
            <div className="mt-4 text-center text-xs text-slate-600">
              {t(dict.fps.moreGames, { count: displayed.length - 150 })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
