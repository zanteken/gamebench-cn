import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseEnabled } from "@/lib/supabase";
import type { CreateFriendRequestInput, UpdateFriendRequestInput } from "@/lib/types";
import crypto from "crypto";

// POST /api/marks/friends — 发送好友请求
export async function POST(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const body = await req.json();
  const {
    from_mark_id,
    from_nickname,
    from_avatar,
    from_contact,
    from_contact_type,
    from_message,
    to_mark_id,
  } = body;

  // 验证
  if (!to_mark_id || !from_contact || !from_nickname) {
    return NextResponse.json(
      { error: "missing_required_fields" },
      { status: 400 }
    );
  }

  if (from_contact.length > 50) {
    return NextResponse.json({ error: "contact_too_long" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 检查目标印记是否存在且开启了交友
  const { data: targetMark } = await supabase
    .from("player_marks")
    .select("id, looking_for_friends, nickname")
    .eq("id", to_mark_id)
    .single();

  if (!targetMark) {
    return NextResponse.json({ error: "mark_not_found" }, { status: 404 });
  }

  if (!targetMark.looking_for_friends) {
    return NextResponse.json({ error: "not_looking_for_friends" }, { status: 400 });
  }

  // 不能加自己
  if (from_mark_id === to_mark_id) {
    return NextResponse.json({ error: "cannot_add_self" }, { status: 400 });
  }

  // IP 频率限制
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "unknown";
  const ipHash = crypto.createHash("sha256").update(ip + "friend-salt").digest("hex").slice(0, 16);

  // 同 IP 每小时最多 5 个好友请求
  const { data: recentRequests } = await supabase
    .from("friend_requests")
    .select("id")
    .eq("from_ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - 3600000).toISOString());

  if (recentRequests && recentRequests.length >= 5) {
    return NextResponse.json({ error: "rate_limit_exceeded" }, { status: 429 });
  }

  // 写入
  const { data, error } = await supabase
    .from("friend_requests")
    .insert({
      from_mark_id: from_mark_id || null,
      from_nickname: from_nickname.trim(),
      from_avatar: from_avatar || "🎮",
      from_contact: from_contact.trim(),
      from_contact_type: from_contact_type || "wechat",
      from_message: (from_message || "").trim().slice(0, 200),
      to_mark_id,
      from_ip_hash: ipHash,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "already_sent" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, request_id: data.id }, { status: 201 });
}

// GET /api/marks/friends?markId=xxx&token=xxx — 查看我收到的好友请求
export async function GET(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const markId = searchParams.get("markId");
  const token = searchParams.get("token");

  if (!markId || !token) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 验证 token
  const { data: mark } = await supabase
    .from("player_marks")
    .select("id, secret_token")
    .eq("id", markId)
    .single();

  if (!mark || mark.secret_token !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 获取好友请求
  const { data: requests, error } = await supabase
    .from("friend_requests")
    .select("id, from_nickname, from_avatar, from_contact, from_contact_type, from_message, status, created_at, responded_at")
    .eq("to_mark_id", markId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(requests || []);
}

// PATCH /api/marks/friends — 接受/拒绝好友请求
export async function PATCH(req: NextRequest) {
  if (!isSupabaseEnabled()) {
    return NextResponse.json({ error: "feature_disabled" }, { status: 503 });
  }

  const body = await req.json();
  const { request_id, token, action, to_contact, to_contact_type, to_message } = body;

  if (!request_id || !token || !action) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  if (!["accept", "reject"].includes(action)) {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // 获取请求
  const { data: request } = await supabase
    .from("friend_requests")
    .select("id, to_mark_id, status")
    .eq("id", request_id)
    .single();

  if (!request) {
    return NextResponse.json({ error: "request_not_found" }, { status: 404 });
  }

  if (request.status !== "pending") {
    return NextResponse.json({ error: "already_processed" }, { status: 400 });
  }

  // 验证接收方身份
  const { data: mark } = await supabase
    .from("player_marks")
    .select("id, secret_token")
    .eq("id", request.to_mark_id)
    .single();

  if (!mark || mark.secret_token !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 更新状态
  const updateData: Record<string, unknown> = {
    status: action === "accept" ? "accepted" : "rejected",
    responded_at: new Date().toISOString(),
  };

  if (action === "accept") {
    if (to_contact) {
      updateData.to_contact = to_contact.trim();
      updateData.to_contact_type = to_contact_type || "wechat";
    }
    if (to_message) {
      updateData.to_message = to_message.trim().slice(0, 200);
    }
  }

  const { error } = await supabase
    .from("friend_requests")
    .update(updateData)
    .eq("id", request_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, status: updateData.status });
}
