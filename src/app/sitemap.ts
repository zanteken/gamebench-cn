import { MetadataRoute } from "next";
import { getAllGames } from "@/lib/games";

const BASE_URL = "https://www.gamebencher.com";
const LOCALES = ["zh", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const games = getAllGames();

  // Static pages for each locale
  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/${locale}/fps-calculator`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/gpu`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/cpu`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/${locale}/download`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]);

  // Game pages for each locale (only zh and en)
  const gamePages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    games.map((game) => ({
      url: `${BASE_URL}/${locale}/game/${game.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...gamePages];
}
