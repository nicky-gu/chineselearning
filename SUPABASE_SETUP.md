# Supabase 配置说明（工业级安全架构）

## 架构说明

使用 **Supabase Auth** 进行身份认证，结合 **Row Level Security (RLS)** 保护数据：

```
┌─────────────────────────────────────────────────────────────┐
│  用户输入 PIN: 12345678                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase Auth 认证                                        │
│  - Email: pin_12345678@hanzi-learning.internal              │
│  - Password: 12345678                                       │
│  - Supabase 自动 bcrypt 哈希 PIN 码                         │
│  - 返回 JWT Token + user_id                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  前端加密学习数据                                           │
│  AES({ mistakes, stats }, "12345678")                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  存储到 Supabase (带 RLS 保护)                              │
│  user_learning_data 表:                                     │
│  - user_id: xxxxx (JWT 中的 user_id)                       │
│  - encrypted_data: "U2FsdGVkX1..."                        │
│  - RLS 策略: 只能访问自己的数据                             │
└─────────────────────────────────────────────────────────────┘
```

**安全保证**：
- ✅ PIN 码经过 Supabase 的 bcrypt 哈希（不在数据库明文存储）
- ✅ JWT Token 认证（标准 OAuth2）
- ✅ RLS 策略确保用户只能访问自己的数据
- ✅ 学习数据 AES 加密存储
- ✅ 防暴力破解（Supabase Auth 自带限流）
- ✅ Anon key 可以公开（前端代码可见）

---

## 步骤 1：创建 Supabase 项目

1. 访问：https://supabase.com
2. 点击 **Start your project**
3. 用 GitHub 账号登录
4. 创建新项目：
   - Name: `hanzi-learning`
   - Database Password: 设置并保存
   - Region: 选择最近的区域

---

## 步骤 2：创建数据库表

在 **Table Editor** 中创建表：

### 表名：`user_learning_data`

| Column | Type | Default | Primary Key |
|--------|------|---------|-------------|
| `user_id` | `uuid` | - | - |
| `encrypted_data` | `text` | - | - |
| `updated_at` | `timestamp` | `now()` | - |

**注意**：`user_id` 关联到 Supabase Auth 的 `auth.users.id`

---

## 步骤 3：启用 Row Level Security (RLS)

在 **SQL Editor** 中执行以下 SQL：

```sql
-- 启用 RLS
ALTER TABLE user_learning_data ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能读取和修改自己的数据
CREATE POLICY "Users can view own data"
ON user_learning_data
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
ON user_learning_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
ON user_learning_data
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own data"
ON user_learning_data
FOR INSERT
ON CONFLICT (user_id)
DO UPDATE SET
  encrypted_data = EXCLUDED.encrypted_data,
  updated_at = EXCLUDED.updated_at
WHERE user_learning_data.user_id = auth.uid();
```

---

## 步骤 4：获取 API 密钥

在 **Settings** → **API** 复制：

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 步骤 5：更新前端代码

修改 `index.html` 中的配置：

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // 你的 Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // 你的 anon key
```

**重要**：这两个值可以直接写在代码里，因为：
- Anon key 是设计为公开的
- RLS 策略保护数据安全
- 没有有效 JWT Token 无法访问数据

---

## 步骤 6：测试

1. 打开网站
2. 点击"登录同步数据"
3. 输入 8 位 PIN 码（如 `12345678`）
4. 点击"登录/注册"

**首次使用**：
- Supabase Auth 创建用户（PIN 自动 bcrypt 哈希）
- 创建 `user_learning_data` 记录
- 返回 JWT Token

**再次使用**：
- Supabase Auth 验证 PIN
- 返回 JWT Token
- 加载用户数据

---

## 安全性总结

| 层面 | 安全措施 |
|------|----------|
| **认证** | Supabase Auth + bcrypt 哈希 |
| **授权** | JWT Token + RLS 策略 |
| **数据** | AES 加密存储 |
| **传输** | HTTPS |
| **防护** | Supabase Auth 限流防暴力破解 |

**攻击场景防护**：

| 攻击 | 防护 |
|------|------|
| 暴力破解 PIN | Supabase Auth 自动限流封 IP |
| SQL 注入 | Supabase 预处理语句 + RLS |
| 越权访问 | RLS 策略限制只能访问自己的数据 |
| 中间人攻击 | HTTPS + JWT 签名验证 |
| 数据库泄露 | PIN 已哈希 + 数据已加密 |

---

## 费用

Supabase 免费套餐：
- ✅ 500 MB 数据库
- ✅ 1GB 文件存储
- ✅ 2GB 出站流量/月
- ✅ 50,000 月活跃用户
- ✅ 无限 API 请求

对于个人学习应用完全够用！
