# 快速启动指南

## 🎉 恭喜！项目已完成

您现在拥有一个完整的基于 Next.js 14 + Supabase + 硅基流动AI 的智能汉字学习系统。

## 📋 前置检查

在开始之前，请确保您已完成：

1. ✅ 阅读 `README.md` 了解项目概况
2. ✅ 阅读 `DEPLOYMENT.md` 了解部署流程
3. ✅ 拥有 GitHub 账号
4. ✅ 拥有 Supabase 账号
5. ✅ 拥有硅基流动账号
6. ✅ 拥有 Vercel 账号

## 🚀 5步启动

### 步骤 1: 创建 Supabase 项目（5分钟）

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写信息：
   - Name: `hanzi-learning`
   - Password: (设置强密码并保存)
   - Region: 选择 `Southeast Asia (Singapore)`
4. 等待创建完成

### 步骤 2: 配置数据库（5分钟）

1. 进入 Supabase 项目 → SQL Editor
2. 点击 "New Query"
3. 复制并执行以下SQL：

```sql
-- 创建所有表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  pin TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE learning_data (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  ai_response JSONB NOT NULL,
  model_used TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_usage_quotas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- RLS策略
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own learning data" ON learning_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI interactions" ON ai_interactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own AI quotas" ON ai_usage_quotas FOR ALL USING (auth.uid() = user_id);

-- 索引
CREATE INDEX idx_learning_data_user_id ON learning_data(user_id);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_usage_quotas_user_date ON ai_usage_quotas(user_id, date);
```

4. 点击 "Run" 执行

### 步骤 3: 获取密钥（2分钟）

1. 进入 Supabase 项目 → Settings → API
2. 复制以下信息并保存：
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. 进入 Settings → Database
4. 找到 "Connection string" → "URI"
5. 复制连接字符串：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 步骤 4: 获取硅基流动API密钥（3分钟）

1. 访问 https://siliconflow.cn
2. 注册/登录账号
3. 进入控制台 → API Keys
4. 点击 "Create New Key"
5. 复制生成的密钥（格式：`sk-...`）
6. **重要**：妥善保存，密钥只显示一次

### 步骤 5: 部署到 Vercel（5分钟）

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 导入你的 GitHub 仓库
5. 配置环境变量：

   | 名称 | 值 |
   |------|-----|
   | `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |
   | `DATABASE_URL` | 你的 Supabase 连接字符串 |
   | `SILICONFLOW_API_KEY` | 你的硅基流动API密钥 |
   | `ENCRYPTION_KEY` | 随机生成（见下方）|

6. 生成加密密钥（在终端执行）：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

7. 点击 "Deploy"
8. 等待部署完成（约3-5分钟）
9. 部署成功后会获得一个 `.vercel.app` 域名

## ✅ 测试您的应用

1. 访问 Vercel 提供的域名
2. 输入任意8位数字PIN码（首次使用会自动注册）
3. 尝试以下功能：
   - ✅ 拼音练习
   - ✅ 听写练习
   - ✅ 声音游戏
   - ✅ 查看错题本
   - ✅ 使用AI助手

## 🎯 下一步

### 立即可用
您的应用现在已经可以使用了！分享域名给用户即可。

### 自定义域名（可选）
1. 购买域名（Namecheap、阿里云等）
2. 在 Vercel 项目中添加域名
3. 配置 DNS 记录

### 增强功能
- 添加更多汉字数据
- 优化 AI prompts
- 自定义样式
- 添加学习报告

## 📊 监控和维护

### Vercel Dashboard
- 查看部署状态
- 监控网站性能
- 查看访问日志
- 设置域名

### Supabase Dashboard
- 监控数据库大小
- 查看用户数量
- 检查 API 使用量
- 备份数据

### 硅基流动控制台
- 查看 API 使用量
- 监控配额
- 查看账单（免费计划为0）

## 🆘 遇到问题？

### 常见问题

**Q: 部署失败怎么办？**
A: 检查 Vercel 部署日志，确认环境变量配置正确。

**Q: AI不响应？**
A: 检查 `SILICONFLOW_API_KEY` 是否正确，确认配额未用尽。

**Q: 数据不保存？**
A: 检查 Supabase 连接，确认 RLS 策略配置正确。

**Q: PIN码登录失败？**
A: 清除浏览器缓存，重新输入8位数字PIN码。

### 获取帮助
- 查看 `DEPLOYMENT.md` 部署指南
- 查看 `README.md` 项目文档
- 提交 GitHub Issue

## 💡 提示

1. **免费额度**：
   - Vercel: 100GB带宽/月
   - Supabase: 500MB数据库 + 50,000用户
   - 硅基流动: 100次/天

2. **何时需要升级**：
   - 超过免费流量限制
   - 需要更多AI请求
   - 数据库空间不足

3. **备份建议**：
   - 定期导出 Supabase 数据
   - GitHub 保存代码备份
   - 记录所有密钥

## 🎉 完成！

您的智能汉字学习系统已经上线！

**分享链接**：[你的Vercel域名]

**示例PIN码**：任意8位数字（如：12345678）

---

祝您使用愉快！如有问题，请随时查阅文档或提交Issue。
