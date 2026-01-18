# 🔧 数据库类型修复说明

## 问题原因

原错误：`ERROR: 42883: operator does not exist: uuid = text`

**原因**：Supabase的 `auth.uid()` 返回的是 `UUID` 类型，但我们的数据库表使用 `TEXT` 类型作为 `id`，导致类型不匹配。

## 解决方案

将所有表的 `id` 字段从 `TEXT` 改为 `UUID` 类型。

## 修复步骤

### 1. 在Supabase SQL编辑器中执行修复后的SQL

```sql
-- 启用UUID扩展（如果还没启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_pin ON users(pin);
```

### 2. 代码已经自动更新

以下文件已更新为使用UUID：

✅ `prisma/schema.prisma` - 所有id字段改为 `@default(uuid()) @db.Uuid`
✅ `lib/siliconflow.ts` - date字段从字符串改为 `DateTime` 对象

### 3. 重新部署

在Vercel重新部署项目：

1. 进入Vercel项目
2. 点击 "Deployments"
3. 找到最新部署，点击 "..." 菜单
4. 选择 "Redeploy"

## 验证修复

执行完SQL后，验证：

```sql
-- 检查表是否创建成功
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('users', 'learning_data', 'ai_interactions', 'ai_usage_quotas')
ORDER BY table_name, ordinal_position;

-- 应该看到所有 id 字段都是 uuid 类型
```

## 注意事项

⚠️ **如果已经有旧表**：

如果您之前已经创建了旧版本的表，需要先删除：

```sql
-- 删除旧表（如果存在）
DROP TABLE IF EXISTS ai_usage_quotas CASCADE;
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS learning_data CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 然后执行上面的新建表SQL
```

## UUID vs CUID 的区别

| 特性 | UUID | CUID |
|------|------|------|
| 长度 | 36字符 | 25字符 |
| 格式 | `550e8400-e29b-41d4-a716-446655440000` | `clh9q3j00000h5r5u5u5u5u5u` |
| 数据库支持 | 原生支持 | 需要TEXT类型 |
| Supabase Auth | ✅ 完美兼容 | ❌ 类型不匹配 |
| 性能 | 索引友好 | 需要转换 |

**结论**：使用UUID更好，因为Supabase Auth本身就使用UUID。

---

现在请在Supabase SQL编辑器中执行修复后的SQL，问题就解决了！🎉
