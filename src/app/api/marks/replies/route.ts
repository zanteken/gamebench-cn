import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";

// GET /api/marks/replies?markId=xxx
export async function GET(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json([]);
  }

  const markId = new URL(req.url).searchParams.get("markId");
  if (!markId) {
    return NextResponse.json({ error: "missing_mark_id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mark_replies")
    .select("*")
    .eq("mark_id", markId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST /api/marks/replies
export async function POST(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const body = await req.json();

  if (!body.mark_id || !body.nickname || !body.content) {
    return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
  }
  if (body.content.length > 300) {
    return NextResponse.json({ error: "content_too_long" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mark_replies")
    .insert({
      mark_id: body.mark_id,
      nickname: body.nickname.trim(),
      avatar: body.avatar || "💬",
      content: body.content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
