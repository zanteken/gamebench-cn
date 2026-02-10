import { MetadataRoute } from "next";
import { getAllGames } from "@/lib/games";
import { cpus, gpus } from "@/lib/fps-predictor";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gamebencher.com";
  const games = getAllGames();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/fps-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/gpu`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cpu`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const gpuPages: MetadataRoute.Sitemap = gpus.map((gpu) => ({
    url: `${baseUrl}/gpu/${gpu.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const cpuPages: MetadataRoute.Sitemap = cpus.map((cpu) => ({
    url: `${baseUrl}/cpu/${cpu.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...gpuPages, ...cpuPages, ...gamePages];
}
