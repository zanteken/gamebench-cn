import { createClient } from "@supabase/supabase-js";

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not set. Player marks feature will be disabled.");
}

// 客户端实例 (浏览器用)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 服务端实例 (API routes 用，有写入权限)
export function createServiceClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

// 检查 Supabase 是否可用
export function isSupabaseEnabled(): boolean {
  return supabase !== null;
}
