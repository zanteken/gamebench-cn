import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";
import type { CreateMarkInput } from "@/lib/types";
import crypto from "crypto";

// GET /api/marks?slug=xxx&sort=latest&page=1&limit=20
export async function GET(req: NextRequest) {
  // 检查 Supabase 是否配置
  if (!isSupabaseEnabled()) {
    return NextResponse.json({
      marks: [],
      total: 0,
      stats: {
        avg_fps: 0,
        mark_count: 0,
        friends_count: 0,
        gpu_distribution: [],
        fps_distribution: [],
      },
    });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const sort = searchParams.get("sort") || "latest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const gpu = searchParams.get("gpu");

  if (!slug) {
    return NextResponse.json({ error: "missing_slug" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const offset = (page - 1) * limit;

  // 构建查询
  let query = supabase
    .from("player_marks")
    .select("*", { count: "exact" })
    .eq("game_slug", slug);

  // GPU 筛选
  if (gpu) {
    query = query.ilike("gpu", `%${gpu}%`);
  }

  // 排序
  switch (sort) {
    case "popular":
      query = query.order("likes_count", { ascending: false });
      break;
    case "friends":
      query = query
        .eq("looking_for_friends", true)
        .order("created_at", { ascending: false });
      break;
    case "similar":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data: marks, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 统计数据
  const statsQuery = await supabase
    .from("player_marks")
    .select("fps_avg, gpu, looking_for_friends")
    .eq("game_slug", slug);

  const allMarks = statsQuery.data || [];
  const fpsValues = allMarks.filter((m) => m.fps_avg).map((m) => m.fps_avg!);
  const avgFps = fpsValues.length > 0
    ? Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length)
    : 0;

  // GPU 分布
  const gpuCount: Record<string, number> = {};
  allMarks.forEach((m) => {
    if (m.gpu) {
      const key = simplifyGpuName(m.gpu);
      gpuCount[key] = (gpuCount[key] || 0) + 1;
    }
  });
  const gpuDistribution = Object.entries(gpuCount)
    .map(([gpu, count]) => ({ gpu, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // FPS 分布
  const fpsBuckets = [
    { bucket: "<30", min: 0, max: 30 },
    { bucket: "30-60", min: 30, max: 60 },
    { bucket: "60-90", min: 60, max: 90 },
    { bucket: "90-120", min: 90, max: 120 },
    { bucket: "120+", min: 120, max: 9999 },
  ];
  const fpsDistribution = fpsBuckets.map((b) => ({
    bucket: b.bucket,
    count: fpsValues.filter((f) => f >= b.min && f < b.max).length,
  }));

  return NextResponse.json({
    marks: marks || [],
    total: count || 0,
    stats: {
      avg_fps: avgFps,
      mark_count: allMarks.length,
      friends_count: allMarks.filter((m) => m.looking_for_friends).length,
      gpu_distribution: gpuDistribution,
      fps_distribution: fpsDistribution,
    },
  });
}

// POST /api/marks
export async function POST(req: NextRequest) {
  // 检查 Supabase 是否配置
  if (!isSupabaseEnabled()) {
    return NextResponse.json(
      { error: "feature_disabled" },
      { status: 503 }
    );
  }

  const body: CreateMarkInput = await req.json();

  // 验证
  if (!body.game_slug || !body.nickname || !body.message || !body.gpu) {
    return NextResponse.json(
      { error: "missing_required_fields" },
      { status: 400 }
    );
  }

  if (body.message.length > 500) {
    return NextResponse.json({ error: "message_too_long" }, { status: 400 });
  }

  if (body.nickname.length > 30) {
    return NextResponse.json({ error: "nickname_too_long" }, { status: 400 });
  }

  // 频率限制: IP 哈希
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "unknown";
  const ipHash = crypto.createHash("sha256").update(ip + "gamebench-salt").digest("hex").slice(0, 16);

  const supabase = createServiceClient();

  // 同 IP 同游戏 1小时内只能发1条
  const { data: recent } = await supabase
    .from("player_marks")
    .select("id")
    .eq("game_slug", body.game_slug)
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - 3600000).toISOString())
    .limit(1);

  if (recent && recent.length > 0) {
    return NextResponse.json(
      { error: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  // 写入
  const { data, error } = await supabase
    .from("player_marks")
    .insert({
      game_app_id: body.game_app_id,
      game_slug: body.game_slug,
      nickname: body.nickname.trim(),
      avatar: body.avatar || "🎮",
      cpu: body.cpu?.trim() || "",
      gpu: body.gpu.trim(),
      ram: body.ram?.trim() || "",
      fps_avg: body.fps_avg || null,
      fps_1_low: body.fps_1_low || null,
      resolution: body.resolution || "1920x1080",
      quality: body.quality || "中",
      message: body.message.trim(),
      tags: (body.tags || []).slice(0, 3),
      looking_for_friends: body.looking_for_friends || false,
      source: body.source || "manual",
      ip_hash: ipHash,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

function simplifyGpuName(name: string): string {
  const match = name.match(/(RTX|GTX|RX|Arc|Radeon|Intel\s+AMD|AMD)\s*\d+\s*\w*/i);
  return match ? match[0].trim() : name.slice(0, 20);
}
