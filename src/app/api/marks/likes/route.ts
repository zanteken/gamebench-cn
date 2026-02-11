import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";

// GET /api/marks/likes?mark_id=xxx&fingerprint=xxx - 检查是否已点赞
export async function GET(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ liked: false });
  }

  const { searchParams } = new URL(req.url);
  const mark_id = searchParams.get("mark_id");
  const fingerprint = searchParams.get("fingerprint");

  if (!mark_id || !fingerprint) {
    return NextResponse.json({ liked: false });
  }

  const supabase = createServiceClient();

  const { data } = await supabase
    .from("mark_likes")
    .select("id")
    .eq("mark_id", mark_id)
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  return NextResponse.json({ liked: !!data });
}

// POST /api/marks/likes { mark_id, fingerprint }
export async function POST(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const { mark_id, fingerprint } = await req.json();

  if (!mark_id || !fingerprint) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 先获取当前点赞数
  const { data: mark } = await supabase
    .from("player_marks")
    .select("likes_count")
    .eq("id", mark_id)
    .single();

  if (!mark) {
    return NextResponse.json({ error: "mark_not_found" }, { status: 404 });
  }

  // 检查是否已点赞
  const { data: existing } = await supabase
    .from("mark_likes")
    .select("id")
    .eq("mark_id", mark_id)
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  if (existing) {
    // 取消点赞
    await supabase.from("mark_likes").delete().eq("id", existing.id);

    // 减少计数
    const newCount = Math.max((mark.likes_count || 0) - 1, 0);
    await supabase
      .from("player_marks")
      .update({ likes_count: newCount })
      .eq("id", mark_id);

    return NextResponse.json({ liked: false, likes_count: newCount });
  } else {
    // 添加点赞
    const { error } = await supabase
      .from("mark_likes")
      .insert({ mark_id, fingerprint });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 增加计数
    const newCount = (mark.likes_count || 0) + 1;
    await supabase
      .from("player_marks")
      .update({ likes_count: newCount })
      .eq("id", mark_id);

    return NextResponse.json({ liked: true, likes_count: newCount });
  }
}
