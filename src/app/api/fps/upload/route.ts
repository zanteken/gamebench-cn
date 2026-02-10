import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";
import type { FpsSessionUpload } from "@/lib/types";

// POST /api/fps/upload
export async function POST(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const body: FpsSessionUpload = await req.json();

  if (!body.game_app_id || !body.cpu || !body.gpu || !body.fps_avg) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 采样 timeline (最多保留 120 个点)
  const timeline = (body.fps_timeline || []).slice(0, 120);

  const { data, error } = await supabase
    .from("fps_sessions")
    .insert({
      game_app_id: body.game_app_id,
      cpu: body.cpu,
      gpu: body.gpu,
      ram_gb: body.ram_gb,
      os: body.os,
      fps_avg: body.fps_avg,
      fps_1_low: body.fps_1_low,
      fps_01_low: body.fps_01_low,
      fps_max: body.fps_max,
      fps_min: body.fps_min,
      total_frames: body.total_frames,
      duration_secs: body.duration_secs,
      resolution: body.resolution,
      quality: body.quality,
      fps_timeline: timeline,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    session_id: data.id,
  }, { status: 201 });
}

// GET /api/fps/upload?appId=xxx
export async function GET(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json([]);
  }

  const appId = new URL(req.url).searchParams.get("appId");
  if (!appId) {
    return NextResponse.json({ error: "missing_app_id" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("fps_sessions")
    .select("cpu, gpu, fps_avg, fps_1_low, resolution, quality, created_at")
    .eq("game_app_id", parseInt(appId))
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
