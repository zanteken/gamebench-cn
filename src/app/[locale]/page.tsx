import { Metadata } from "next";
import { getGamesForList, getAllGenres } from "@/lib/games";
import GameListClient from "@/components/GameListClient";
import { locales, type Locale, getDictionary } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const games = getGamesForList();

  return {
    title: dict.home.title,
    description: t(dict.siteDescription, { count: games.length }),
  };
}

function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
  }
  return result;
}

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const games = getGamesForList();
  const genres = getAllGenres();

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          {dict.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-slate-400">
          {t(dict.siteDescription, { count: games.length })}
        </p>
      </section>

      {/* Stats bar */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: dict.home.statsGames, value: `${games.length.toLocaleString()}+`, icon: "🎮" },
          { label: dict.home.statsCPU, value: "500+", icon: "⚡" },
          { label: dict.home.statsGPU, value: "300+", icon: "🖥️" },
          { label: dict.home.statsFPS, value: "建设中", icon: "📊" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border border-[#1e293b] bg-[#1a2233] p-4"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* 游戏列表 */}
      <GameListClient games={games} genres={genres} locale={locale} dict={dict} />
    </div>
  );
}
