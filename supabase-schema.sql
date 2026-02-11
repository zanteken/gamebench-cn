-- =============================================
-- GameBench CN — 玩家印记系统数据库
-- 运行在 Supabase (PostgreSQL)
-- =============================================

-- 1. 玩家印记主表
CREATE TABLE player_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 游戏关联
  game_app_id INTEGER NOT NULL,           -- Steam AppId
  game_slug TEXT NOT NULL,                 -- URL slug
  
  -- 玩家信息
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 30),
  avatar TEXT NOT NULL DEFAULT '🎮',       -- emoji 头像
  
  -- 硬件配置
  cpu TEXT NOT NULL DEFAULT '',
  gpu TEXT NOT NULL DEFAULT '',
  ram TEXT NOT NULL DEFAULT '',
  
  -- 性能数据
  fps_avg REAL,                            -- 平均 FPS
  fps_1_low REAL,                          -- 1% Low
  fps_01_low REAL,                         -- 0.1% Low
  resolution TEXT DEFAULT '1920x1080',     -- 分辨率
  quality TEXT DEFAULT '中',               -- 画质预设
  
  -- 社交内容
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  tags TEXT[] DEFAULT '{}',                -- 标签数组
  looking_for_friends BOOLEAN DEFAULT false,
  
  -- 数据来源
  source TEXT DEFAULT 'manual',            -- 'manual' | 'desktop_app' | 'auto'
  session_id TEXT,                          -- 桌面端 FPS session ID (关联详细帧数据)
  
  -- 统计
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- 元数据
  ip_hash TEXT,                            -- IP 哈希 (防刷，不存原始 IP)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 回复表
CREATE TABLE mark_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mark_id UUID NOT NULL REFERENCES player_marks(id) ON DELETE CASCADE,
  
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 30),
  avatar TEXT NOT NULL DEFAULT '🎮',
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 300),
  
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 点赞表 (防重复)
CREATE TABLE mark_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mark_id UUID NOT NULL REFERENCES player_marks(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,               -- 浏览器指纹 (匿名用户)
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(mark_id, fingerprint)
);

-- 4. 好友请求表
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_mark_id UUID REFERENCES player_marks(id) ON DELETE CASCADE,  -- 可为空（非印记用户发起）
  to_mark_id UUID NOT NULL REFERENCES player_marks(id) ON DELETE CASCADE,

  -- 发起方信息（冗余存储，便于显示）
  from_nickname TEXT NOT NULL CHECK (char_length(from_nickname) BETWEEN 1 AND 30),
  from_avatar TEXT NOT NULL DEFAULT '🎮',
  from_contact TEXT NOT NULL CHECK (char_length(from_contact) <= 50),
  from_contact_type TEXT DEFAULT 'wechat',    -- 'wechat' | 'qq' | 'steam' | 'discord'
  from_message TEXT DEFAULT '',               -- 附言（最多200字）

  -- 接收方信息（接受后填写）
  to_contact TEXT,                         -- 接收方的联系方式
  to_contact_type TEXT,                      -- 接收方的联系方式类型
  to_message TEXT,                           -- 接收方的回复

  -- IP 频率限制
  from_ip_hash TEXT,                         -- 发起方 IP 哈希（防滥用）

  status TEXT DEFAULT 'pending',               -- 'pending' | 'accepted' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ,                 -- 处理时间

  -- 防止同一对用户重复请求
  UNIQUE(to_mark_id, from_contact)
);

-- 5. FPS Session 详细数据 (桌面端上传)
CREATE TABLE fps_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mark_id UUID REFERENCES player_marks(id) ON DELETE SET NULL,
  
  game_app_id INTEGER NOT NULL,
  
  -- 硬件 (自动检测)
  cpu TEXT NOT NULL,
  gpu TEXT NOT NULL,
  ram_gb REAL,
  os TEXT,
  
  -- 性能汇总
  fps_avg REAL NOT NULL,
  fps_1_low REAL,
  fps_01_low REAL,
  fps_max REAL,
  fps_min REAL,
  total_frames BIGINT,
  duration_secs REAL,
  
  -- 设置
  resolution TEXT,
  quality TEXT,
  
  -- 原始帧时间数据 (采样，不存全部)
  -- 每 10 秒存一个快照: {elapsed_secs, fps, fps_1_low, frametime_ms}
  fps_timeline JSONB DEFAULT '[]',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== 索引 ====================

CREATE INDEX idx_marks_game ON player_marks(game_app_id);
CREATE INDEX idx_marks_game_slug ON player_marks(game_slug);
CREATE INDEX idx_marks_created ON player_marks(created_at DESC);
CREATE INDEX idx_marks_likes ON player_marks(likes_count DESC);
CREATE INDEX idx_marks_friends ON player_marks(looking_for_friends) WHERE looking_for_friends = true;
CREATE INDEX idx_marks_gpu ON player_marks(gpu);
CREATE INDEX idx_friend_requests_to ON friend_requests(to_mark_id);
CREATE INDEX idx_friend_requests_ip_time ON friend_requests(from_ip_hash, created_at);

CREATE INDEX idx_replies_mark ON mark_replies(mark_id);
CREATE INDEX idx_likes_mark ON mark_likes(mark_id);
CREATE INDEX idx_sessions_game ON fps_sessions(game_app_id);

-- ==================== RLS 策略 (Row Level Security) ====================

ALTER TABLE player_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE fps_sessions ENABLE ROW LEVEL SECURITY;

-- 所有人可读印记
CREATE POLICY "marks_read" ON player_marks FOR SELECT USING (true);
-- 通过 API 写入 (service_role key)
CREATE POLICY "marks_insert" ON player_marks FOR INSERT WITH CHECK (true);

CREATE POLICY "replies_read" ON mark_replies FOR SELECT USING (true);
CREATE POLICY "replies_insert" ON mark_replies FOR INSERT WITH CHECK (true);

CREATE POLICY "likes_read" ON mark_likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON mark_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_delete" ON mark_likes FOR DELETE USING (true);

CREATE POLICY "sessions_read" ON fps_sessions FOR SELECT USING (true);
CREATE POLICY "sessions_insert" ON fps_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "friends_read" ON friend_requests FOR SELECT USING (true);
CREATE POLICY "friends_insert" ON friend_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "friends_update" ON friend_requests FOR UPDATE USING (true);

-- ==================== 触发器 ====================

-- 回复计数自动更新
CREATE OR REPLACE FUNCTION update_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE player_marks SET replies_count = replies_count + 1 WHERE id = NEW.mark_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE player_marks SET replies_count = replies_count - 1 WHERE id = OLD.mark_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_replies_count
AFTER INSERT OR DELETE ON mark_replies
FOR EACH ROW EXECUTE FUNCTION update_replies_count();

-- 点赞计数自动更新
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE player_marks SET likes_count = likes_count + 1 WHERE id = NEW.mark_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE player_marks SET likes_count = likes_count - 1 WHERE id = OLD.mark_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_likes_count
AFTER INSERT OR DELETE ON mark_likes
FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- updated_at 自动更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_marks_updated
BEFORE UPDATE ON player_marks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
