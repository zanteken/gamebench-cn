import { Metadata } from "next";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import { getAllGames } from "@/lib/games";
import FPSCalculatorClient from "./FPSCalculatorClient";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const dict = getDictionary(params.locale as Locale);
  return {
    title: dict.fps.title.replace("🎯 ", ""),
    description: dict.fps.subtitle.replace("{count}", "5000+"),
    alternates: {
      languages: { zh: "/zh/fps-calculator", en: "/en/fps-calculator" },
    },
  };
}

export default function FPSCalculatorPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const allGames = getAllGames();
  const gamesForCalc = allGames.map((g) => ({
    appId: g.appId,
    name: g.name,
    slug: g.slug,
    headerImage: g.headerImage,
    genres: g.genres,
    requirements: g.requirements,
  }));

  return <FPSCalculatorClient games={gamesForCalc} locale={locale} dict={dict} />;
}
