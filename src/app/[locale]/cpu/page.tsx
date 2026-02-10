import { Metadata } from "next";
import Link from "next/link";
import { cpus } from "@/lib/fps-predictor";
import { getDictionary, type Locale, t } from "@/i18n/dictionaries";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const dict = getDictionary(params.locale as Locale);
  return {
    title: dict.tier.cpuTitle.replace("🧠 ", ""),
    description: dict.tier.cpuSubtitle,
    alternates: { languages: { zh: "/zh/cpu", en: "/en/cpu" } },
  };
}

export default function CPUIndexPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const intelCPUs = cpus.filter((c) => c.brand === "Intel").sort((a, b) => b.score - a.score);
  const amdCPUs = cpus.filter((c) => c.brand === "AMD").sort((a, b) => b.score - a.score);

  const tierColor = (s: number) => s >= 75 ? "bg-emerald-500" : s >= 50 ? "bg-blue-500" : s >= 25 ? "bg-yellow-500" : "bg-slate-500";

  const CPUGroup = ({ title, items, color }: { title: string; items: typeof cpus; color: string }) => (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
        <span className={`inline-block h-3 w-3 rounded-full ${color}`} />{title}
      </h2>
      <div className="space-y-1">
        {items.map((cpu) => (
          <Link key={cpu.id} href={`/${locale}/cpu/${cpu.id}`}
            className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#131c2e] px-4 py-2.5 transition hover:border-[#2a3548] hover:bg-[#1a2540]">
            <div className="w-16 shrink-0"><div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
              <div className={`h-full rounded-full ${tierColor(cpu.score)}`} style={{ width: `${cpu.score}%` }} /></div></div>
            <span className="flex-1 text-sm font-medium text-white">{cpu.name}</span>
            <span className="hidden sm:inline text-xs text-slate-500">{cpu.cores}C{cpu.threads}T · {cpu.year}</span>
            <span className="w-10 text-right text-sm font-bold text-slate-300 tabular-nums">{cpu.score}</span>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-white">{dict.tier.cpuTitle}</h1>
      <p className="mb-6 text-sm text-slate-400">{dict.tier.cpuSubtitle} · {t(dict.tier.cpuCount, { count: cpus.length })}</p>
      <CPUGroup title="Intel Core" items={intelCPUs} color="bg-blue-500" />
      <CPUGroup title="AMD Ryzen" items={amdCPUs} color="bg-red-500" />
    </div>
  );
}
