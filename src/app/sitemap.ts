import { MetadataRoute } from "next";
import { getAllGames } from "@/lib/games";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.gamebencher.com";

  const games = getAllGames();

  const gamePages = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/fps-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...gamePages,
  ];
}
