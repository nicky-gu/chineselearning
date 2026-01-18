# Vercel环境变量配置指南

## 需要配置的环境变量

您需要在Vercel项目的Settings → Environment Variables中添加以下环境变量：

### 1. 从Supabase获取

#### NEXT_PUBLIC_SUPABASE_URL
- **类型**: Public (公开)
- **获取方式**:
  1. 进入Supabase项目
  2. 点击左侧菜单 "Settings" → "API"
  3. 复制 "Project URL" 字段的值
  4. 格式: `https://xxxxx.supabase.co`

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **类型**: Public (公开)
- **获取方式**:
  1. 在同一个页面 (Settings → API)
  2. 复制 "anon public" 密钥
  3. 格式: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### DATABASE_URL
- **类型**: Secret (私密)
- **获取方式**:
  1. 进入Supabase项目
  2. 点击左侧菜单 "Settings" → "Database"
  3. 找到 "Connection string" 部分
  4. 选择 "URI" 标签
  5. 复制连接字符串
  6. 格式: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
  7. **重要**: 将 `[YOUR-PASSWORD]` 替换为您创建Supabase项目时设置的密码

### 2. 从硅基流动获取

#### SILICONFLOW_API_KEY
- **类型**: Secret (私密)
- **获取方式**:
  1. 访问 https://siliconflow.cn
  2. 登录账号
  3. 进入控制台 → API Keys
  4. 创建新密钥（如果还没有）
  5. 复制API密钥
  6. 格式: `sk-xxxxxxxxxxxxx`

### 3. 需要生成的

#### ENCRYPTION_KEY
- **类型**: Secret (私密)
- **生成方式**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **用途**: 用于加密用户学习数据
- **格式**: 64位十六进制字符串

#### NEXT_PUBLIC_APP_URL
- **类型**: Public (公开)
- **值**:
  - 开发环境: `http://localhost:3000`
  - 生产环境: `https://your-domain.vercel.app` 或您的自定义域名

## 在Vercel中配置步骤

### 1. 打开环境变量设置

1. 登录Vercel Dashboard
2. 选择您的项目
3. 点击顶部 "Settings" 标签
4. 左侧菜单点击 "Environment Variables"

### 2. 逐个添加环境变量

对于每个环境变量：

1. 在 "Key" 字段输入变量名（如: `NEXT_PUBLIC_SUPABASE_URL`）
2. 在 "Value" 字段输入对应的值
3. 选择环境:
   - **Production**: 生产环境（必选）
   - **Preview**: 预览环境（推荐）
   - **Development**: 开发环境（可选）
4. 点击 "Add" 或 "Save"

### 3. 配置列表

完整的环境变量列表：

| Key | Value | 环境 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 您的Supabase URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 您的Supabase anon key | All |
| `DATABASE_URL` | 您的数据库连接字符串 | All |
| `SILICONFLOW_API_KEY` | 您的硅基流动API密钥 | All |
| `ENCRYPTION_KEY` | 随机生成的64位密钥 | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | All |

### 4. 重要提示

⚠️ **注意事项**:

1. **DATABASE_URL** 中的密码必须正确
   - 使用您创建Supabase项目时设置的数据库密码
   - 如果忘记了，可以在Supabase重置数据库密码

2. **ENCRYPTION_KEY** 一旦设置不要更改
   - 更改会导致已加密的数据无法解密
   - 妥善保存这个密钥

3. **环境选择**
   - 建议在所有环境（Production, Preview, Development）都配置
   - 这样预览部署也能正常工作

4. **重新部署**
   - 添加环境变量后需要重新部署才能生效
   - 点击 "Deployments" 标签
   - 点击最新的部署右侧的 "..." 菜单
   - 选择 "Redeploy"

### 5. 验证配置

部署完成后，检查：

1. ✅ 网站能正常访问
2. ✅ 能输入PIN码登录
3. ✅ 登录后能看到仪表板
4. ✅ 练习功能正常
5. ✅ AI助手有响应

如果遇到问题，查看：
- Vercel部署日志
- 浏览器控制台错误
- Supabase日志

## 快速配置命令（可选）

如果您使用Vercel CLI：

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add DATABASE_URL
vercel env add SILICONFLOW_API_KEY
vercel env add ENCRYPTION_KEY
vercel env add NEXT_PUBLIC_APP_URL

# 重新部署
vercel --prod
```

## 常见问题

**Q: 我忘记数据库密码怎么办？**
A: 在Supabase项目设置中重置数据库密码，然后更新 `DATABASE_URL`

**Q: ENCRYPTION_KEY可以改吗？**
A: 不建议。更改后需要重新加密所有用户数据

**Q: 硅基流动API密钥在哪里？**
A: 访问 siliconflow.cn → 控制台 → API Keys

**Q: 配置后需要重启吗？**
A: 是的，需要在Vercel重新部署项目

---

配置完成后，您的应用就可以正常运行了！🎉
