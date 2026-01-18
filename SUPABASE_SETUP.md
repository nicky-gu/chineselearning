# Supabase 配置说明

## 步骤 1：创建 Supabase 项目

1. 访问：https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目：
   - Organization: 选择或创建组织
   - Name: `hanzi-learning` (或其他名称)
   - Database Password: 设置一个密码（请保存好）
   - Region: 选择最近的区域（如 Singapore）
5. 等待项目创建完成（约 2 分钟）

---

## 步骤 2：创建数据库表

1. 在 Supabase Dashboard 中，进入 **Table Editor**
2. 点击 **New table**
3. 创建表：

### 表名：`user_data`

| Column | Type | Default | Primary Key |
|--------|------|---------|-------------|
| `pin` | `text` | - | ✅ Yes |
| `encrypted_data` | `text` | - | - |
| `updated_at` | `timestamp` | `now()` | - |

---

## 步骤 3：获取 API 密钥

1. 在 Supabase Dashboard 中，进入 **Settings** → **API**
2. 复制以下信息：

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 步骤 4：配置 RLS（Row Level Security）- 可选

如果需要额外的安全保护：

1. 进入 **SQL Editor**
2. 执行以下 SQL：

```sql
-- 启用 RLS
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（因为数据已加密）
CREATE POLICY "Allow all access" ON user_data
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## 步骤 5：更新前端代码

打开 `index.html`，找到以下部分：

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

替换为：

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';  // 你的 Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // 你的 anon key
```

---

## 步骤 6：测试

1. 打开网站
2. 点击"登录同步数据"
3. 输入 8 位 PIN 码（如 `12345678`）
4. 点击"登录/注册"

如果是新用户，会自动创建 Supabase 记录。
如果是老用户，会从 Supabase 加载数据。

---

## 数据安全说明

- **加密存储**：所有学习数据用 PIN 码进行 AES 加密后存储
- **PIN 码不存储**：PIN 码只存在于用户浏览器内存中
- **Supabase 安全**：即使数据库被访问，没有 PIN 码也无法解密数据

---

## 费用

Supabase 免费套餐：
- 500 MB 数据库存储
- 1 GB 文件存储
- 2GB 出站流量/月
- 50,000 月活跃用户

对于个人学习应用完全够用！
