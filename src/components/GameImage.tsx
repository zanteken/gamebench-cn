"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * 游戏封面图片组件，带多级 fallback：
 * 1. 尝试加载原始 URL
 * 2. 失败后尝试 Steam CDN 稳定 URL
 * 3. 都失败则显示渐变色占位图 + 游戏名首字
 */

interface Props {
  src: string | null | undefined;
  alt: string;
  appId: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

// Steam CDN 稳定图片 URL（不含 hash，长期有效）
function getSteamFallbackUrl(appId: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
}

// 根据游戏名生成一个稳定的渐变色（同一个名字每次颜色一样）
function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 50%, 25%), hsl(${h2}, 60%, 15%))`;
}

export default function GameImage({
  src,
  alt,
  appId,
  fill = true,
  sizes,
  priority = false,
  className = "",
}: Props) {
  const [imgSrc, setImgSrc] = useState(src || getSteamFallbackUrl(appId));
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (imgSrc !== getSteamFallbackUrl(appId)) {
      // 第一次失败：切换到稳定 URL
      setImgSrc(getSteamFallbackUrl(appId));
    } else {
      // 稳定 URL 也失败：显示占位图
      setFailed(true);
    }
  };

  if (failed || !imgSrc) {
    // 渐变色占位图
    const initial = alt.replace(/[^\w\u4e00-\u9fff]/g, "").slice(0, 2) || "🎮";
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: getGradient(alt),
          position: fill ? "absolute" : "relative",
          inset: fill ? 0 : undefined,
          width: fill ? undefined : "100%",
          height: fill ? undefined : "100%",
        }}
      >
        <span className="text-2xl font-bold text-white/60 select-none">
          {initial}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={handleError}
      unoptimized={true} // 避免 Next.js 图片优化对外部 URL 报错
    />
  );
}
