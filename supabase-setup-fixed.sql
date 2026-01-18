-- 修复后的Supabase数据库设置SQL
-- 解决 auth.uid() (UUID) 与 id (TEXT) 类型不匹配的问题

-- 创建所有表（使用 UUID 作为 id 类型）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  pin TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE learning_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  pinyin_practice JSONB DEFAULT '{}',
  dictation_practice JSONB DEFAULT '{}',
  sound_game JSONB DEFAULT '{}',
  mistakes_dictation JSONB DEFAULT '{}',
  mistakes_sound JSONB DEFAULT '{}',
  statistics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  ai_response JSONB NOT NULL,
  model_used TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_usage_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 启用UUID扩展（如果还没启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_quotas ENABLE ROW LEVEL SECURITY;

-- RLS策略（现在类型匹配了）
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own learning data" ON learning_data FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own AI interactions" ON ai_interactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own AI quotas" ON ai_usage_quotas FOR ALL USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_learning_data_user_id ON learning_data(user_id);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at DESC);
CREATE INDEX idx_ai_usage_quotas_user_date ON ai_usage_quotas(user_id, date);

-- 为用户表添加邮箱搜索索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_pin ON users(pin);
