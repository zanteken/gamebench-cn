import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";

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

  // 检查是否已点赞
  const { data: existing } = await supabase
    .from("mark_likes")
    .select("id")
    .eq("mark_id", mark_id)
    .eq("fingerprint", fingerprint)
    .single();

  if (existing) {
    // 取消点赞
    await supabase.from("mark_likes").delete().eq("id", existing.id);
    return NextResponse.json({ liked: false });
  } else {
    // 添加点赞
    const { error } = await supabase
      .from("mark_likes")
      .insert({ mark_id, fingerprint });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ liked: true });
  }
}
