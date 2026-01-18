# 部署指南

本文档详细说明如何将汉字学习应用部署到生产环境。

## 前置要求

- GitHub账号
- Supabase账号
- 硅基流动账号
- Vercel账号

## 部署步骤

### 1. 准备Supabase数据库

#### 1.1 创建Supabase项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击"New Project"
3. 填写项目信息：
   - Name: `hanzi-learning`
   - Database Password: (保存好密码)
   - Region: 选择离用户最近的区域
4. 等待项目创建完成（约2分钟）

#### 1.2 获取数据库连接字符串

1. 进入项目 → Settings → Database
2. 找到"Connection string" → "URI"
3. 复制连接字符串，格式如下：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

#### 1.3 获取API密钥

1. 进入项目 → Settings → API
2. 复制以下信息：
   - Project URL: `https://[PROJECT-REF].supabase.co`
   - anon/public key: 在"Project API keys"下

#### 1.4 创建数据库表

在SQL Editor中执行以下SQL：

```sql
-- 创建用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  pin TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建学习数据表
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

-- 创建AI交互表
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

-- 创建AI配额表
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

-- 创建RLS策略
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own learning data"
  ON learning_data FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI interactions"
  ON ai_interactions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI quotas"
  ON ai_usage_quotas FOR ALL
  USING (auth.uid() = user_id);

-- 创建索引
CREATE INDEX idx_learning_data_user_id ON learning_data(user_id);
CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX idx_ai_usage_quotas_user_date ON ai_usage_quotas(user_id, date);
```

### 2. 准备硅基流动AI

#### 2.1 注册账号

1. 访问 [https://siliconflow.cn](https://siliconflow.cn)
2. 注册账号并登录
3. 进入控制台

#### 2.2 获取API密钥

1. 进入"API Keys"页面
2. 点击"Create New Key"
3. 复制生成的API密钥（格式：`sk-...`）
4. **重要**：密钥只显示一次，请妥善保存

#### 2.3 查看配额

免费计划包含：
- 每日100次请求
- 完全免费的中文模型
- Qwen、DeepSeek、GLM等模型

### 3. 部署到Vercel

#### 3.1 准备代码仓库

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Next.js hanzi learning app"

# 推送到GitHub
git remote add origin https://github.com/your-username/hanzi-learning.git
git branch -M main
git push -u origin main
```

#### 3.2 连接Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"Add New Project"
4. 导入你的GitHub仓库

#### 3.3 配置环境变量

在Vercel项目设置中添加以下环境变量：

| 名称 | 值 | 说明 |
|------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | 公开变量 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 公开变量 |
| `DATABASE_URL` | Supabase数据库连接字符串 | 私密变量 |
| `SILICONFLOW_API_KEY` | 硅基流动API密钥 | 私密变量 |
| `ENCRYPTION_KEY` | 随机生成的加密密钥 | 私密变量 |

生成加密密钥：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3.4 部署配置

确保`vercel.json`文件配置正确：
- 设置正确的build命令
- 配置环境变量引用
- 选择部署区域（推荐香港：hkg1）

#### 3.5 开始部署

1. 点击"Deploy"
2. 等待部署完成（约3-5分钟）
3. 部署成功后会获得一个`.vercel.app`域名

### 4. 配置自定义域名（可选）

#### 4.1 购买域名

从以下平台购买域名：
- Namecheap
- GoDaddy
- 阿里云
- 腾讯云

#### 4.2 在Vercel中添加域名

1. 进入项目 → Settings → Domains
2. 点击"Add Domain"
3. 输入你的域名
4. 按照Vercel的指示配置DNS记录

#### 4.3 DNS配置

如果是根域名（如 `example.com`），添加A记录：
```
Type: A
Name: @
Value: 76.76.21.21
```

如果是子域名（如 `app.example.com`），添加CNAME记录：
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 5. 验证部署

#### 5.1 功能检查清单

- [ ] 首页正常加载
- [ ] PIN码登录功能正常
- [ ] 拼音练习功能正常
- [ ] 听写练习功能正常
- [ ] 声音游戏功能正常
- [ ] 错题本功能正常
- [ ] AI助手功能正常
- [ ] 数据正常保存到Supabase
- [ ] AI响应正常

#### 5.2 性能检查

使用Vercel Analytics查看：
- 页面加载时间
- Core Web Vitals
- 错误率

### 6. 监控和维护

#### 6.1 日志监控

- Vercel Dashboard → Logs
- 查看错误和警告
- 设置告警通知

#### 6.2 数据库监控

- Supabase Dashboard → Reports
- 监控数据库大小
- 查看慢查询

#### 6.3 AI使用监控

- 监控每日AI请求量
- 查看用户配额使用情况
- 优化prompt降低token使用

### 7. 备份策略

#### 7.1 数据库备份

Supabase自动备份：
- 每日自动备份
- 保留7天
- 可手动创建备份

#### 7.2 代码备份

- GitHub版本控制
- 定期推送到远程仓库
- 打tag标记重要版本

### 8. 安全检查清单

- [ ] 所有API密钥使用环境变量
- [ ] 启用Supabase RLS
- [ ] 使用HTTPS
- [ ] 定期更新依赖
- [ ] 设置速率限制
- [ ] 启用错误追踪

### 9. 成本估算

#### 免费计划限制

**Vercel免费计划：**
- 100GB带宽/月
- 无限部署
- 自动SSL
- 边缘网络CDN

**Supabase免费计划：**
- 500MB数据库存储
- 1GB文件存储
- 50,000 MAU（月活用户）
- 无限API请求

**硅基流动免费计划：**
- 每日100次AI请求
- 完全免费的中文模型

#### 何时需要升级

- Vercel: 超过100GB带宽/月
- Supabase: 超过500MB数据库或50,000 MAU
- 硅基流动: 超过每日100次请求

### 10. 故障排查

#### 常见问题

**问题1: 部署失败**
- 检查build日志
- 确认所有依赖已安装
- 验证环境变量配置

**问题2: 数据库连接失败**
- 验证DATABASE_URL正确
- 检查Supabase项目状态
- 确认RLS策略配置正确

**问题3: AI不响应**
- 验证SILICONFLOW_API_KEY
- 检查每日配额是否用尽
- 查看AI服务状态

**问题4: 数据不保存**
- 检查浏览器localStorage
- 验证Supabase连接
- 查看网络请求错误

### 11. 更新和维护

#### 更新流程

1. 在本地测试新功能
2. 提交到GitHub
3. Vercel自动部署预览版本
4. 验证后合并到main分支
5. 自动部署到生产环境

#### 依赖更新

```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update

# 测试更新
npm run build
npm run dev
```

### 12. 联系和支持

如有问题，请通过以下方式联系：
- GitHub Issues
- 项目文档
- 社区论坛

---

祝部署顺利！🎉
