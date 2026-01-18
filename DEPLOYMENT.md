# 部署说明

## 架构说明

```
用户浏览器 → Cloudflare Workers (API代理) → GitHub API
              Token 在这里 (安全)            需要认证
```

**优点**：
- GitHub Token 永远不暴露在前端代码中
- 免费使用 Cloudflare Workers (每天 100,000 次请求)
- 代码开源安全

---

## 部署步骤

### 1. 部署 Cloudflare Workers

#### 安装 Wrangler CLI

```bash
npm install -g wrangler
```

#### 登录 Cloudflare

```bash
wrangler login
```

#### 设置环境变量

```bash
# 设置 GitHub Token
wrangler secret put HANZI_GITHUB_TOKEN
# 然后输入你的 token: YOUR_GITHUB_TOKEN_HERE
```

#### 部署 Worker

```bash
cd C:/coding/thomaslearning
wrangler deploy
```

部署成功后会显示你的 Worker URL，例如：
```
https://hanzi-learning-api.your-subdomain.workers.dev
```

---

### 2. 更新前端代码

打开 `index.html`，修改 API_BASE_URL：

```javascript
// 修改为你的 Worker URL
const API_BASE_URL = 'https://hanzi-learning-api.your-subdomain.workers.dev';
```

---

### 3. 部署前端到 GitHub Pages

```bash
git add .
git commit -m "Update API URL"
git push
```

前端会自动部署到：https://chineselearning.789123123.xyz

---

## Cloudflare Workers 环境变量设置（可选）

如果你想在 Cloudflare Dashboard 中设置变量：

1. 访问：https://dash.cloudflare.com
2. 选择你的 Workers 服务
3. 进入 Settings → Variables and Secrets
4. 添加：
   - Name: `HANZI_GITHUB_TOKEN`
   - Value: `YOUR_GITHUB_TOKEN_HERE`

---

## 文件说明

| 文件 | 作用 |
|------|------|
| `index.html` | 前端应用 |
| `worker.js` | Cloudflare Workers 代理 |
| `wrangler.toml` | Workers 配置文件 |
| `CNAME` | 自定义域名配置 |
