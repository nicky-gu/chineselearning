# 汉字学习 - 智能AI学习系统

基于 Next.js 14 + Supabase + 硅基流动AI 构建的智能汉字学习平台。

## ✨ 功能特性

### 📚 核心学习功能
- **拼音练习**: 学习汉字正确发音，AI实时纠错
- **听写练习**: 听音频写汉字，提高听力理解
- **声音游戏**: 趣味声调辨识游戏
- **错题本**: 自动记录错题，针对性复习
- **学习统计**: 详细数据分析，追踪学习进度

### 🤖 AI智能功能（硅基流动）
- **拼音纠错**: AI自动检查并纠正拼音错误
- **智能组词**: 为汉字生成常用词语
- **造句助手**: 用词语生成例句
- **学习助手**: 24/7 AI答疑解惑
- **进度分析**: AI分析学习数据，提供个性化建议

### 🔒 安全特性
- **PIN码认证**: 8位数字PIN码安全登录
- **数据加密**: AES-256加密存储学习数据
- **隐私保护**: 符合儿童隐私保护标准

## 🛠️ 技术栈

### 前端
- **Next.js 14**: App Router + Server Actions
- **TypeScript**: 类型安全
- **Tailwind CSS**: 现代化UI设计
- **shadcn/ui**: 高质量组件库
- **Radix UI**: 无障碍组件

### 后端
- **Next.js Server Actions**: 服务端逻辑
- **Prisma ORM**: 类型安全的数据库操作
- **Supabase**: 认证 + PostgreSQL数据库
- **Vercel AI SDK**: AI流式响应

### AI服务
- **硅基流动**: 免费中文AI模型
  - Qwen/Qwen3-8B（主要对话）
  - Qwen/Qwen2.5-7B-Instruct（拼音纠错）
  - deepseek-ai/DeepSeek-R1-Distill-Qwen-7B（推理分析）
  - THUDM/glm-4-9b-chat（通用对话）

### 部署
- **Vercel**: 自动化部署
- **GitHub**: 版本控制
- **Supabase Cloud**: 数据库托管

## 📦 安装步骤

### 1. 克隆项目

\`\`\`bash
git clone https://github.com/your-username/hanzi-learning.git
cd hanzi-learning
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

### 3. 配置环境变量

复制 \`.env.local.example\` 为 \`.env.local\`：

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

填写以下环境变量：

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 硅基流动 AI
SILICONFLOW_API_KEY=your_siliconflow_api_key

# 数据库连接（Prisma）
DATABASE_URL=your_supabase_database_connection_string

# 加密密钥
ENCRYPTION_KEY=your_random_encryption_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. 获取API密钥

#### Supabase设置
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取项目URL和anon key
4. 在SQL编辑器中执行以下SQL：

\`\`\`sql
-- 启用RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_quotas ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can only access their own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can only access their own learning data"
ON learning_data FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own AI interactions"
ON ai_interactions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own AI quotas"
ON ai_usage_quotas FOR ALL
USING (auth.uid() = user_id);
\`\`\`

#### 硅基流动AI设置
1. 访问 [siliconflow.cn](https://siliconflow.cn)
2. 注册账号并获取API密钥
3. 免费计划提供每日100次请求

### 5. 初始化数据库

\`\`\`bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库schema
npx prisma db push

# (可选) 创建迁移
npx prisma migrate dev --name init
\`\`\`

### 6. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

## 🚀 部署到Vercel

### 1. 准备部署

\`\`\`bash
# 构建项目
npm run build

# 测试生产版本
npm start
\`\`\`

### 2. 连接Vercel

1. 安装Vercel CLI

\`\`\`bash
npm i -g vercel
\`\`\`

2. 登录并部署

\`\`\`bash
vercel login
vercel
\`\`\`

### 3. 配置环境变量

在Vercel Dashboard中设置以下环境变量：
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`SILICONFLOW_API_KEY\`
- \`DATABASE_URL\`
- \`ENCRYPTION_KEY\`

### 4. 自动部署

推送到GitHub主分支将自动触发部署：

\`\`\`bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
\`\`\`

## 📁 项目结构

\`\`\`
hanzi-learning/
├── app/                      # Next.js App Router
│   ├── auth/                # 认证相关
│   │   └── actions.ts       # Server Actions
│   ├── ai/                  # AI功能
│   │   └── actions.ts       # AI Server Actions
│   ├── practice/            # 练习模式
│   │   ├── pinyin/          # 拼音练习
│   │   ├── dictation/       # 听写练习
│   │   └── sound/           # 声音游戏
│   ├── ai-assistant/        # AI助手
│   ├── mistakes/            # 错题本
│   ├── dashboard/           # 仪表板
│   ├── profile/             # 个人中心
│   ├── login/               # 登录页
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/              # React组件
│   └── ui/                  # shadcn/ui组件
├── lib/                     # 工具库
│   ├── supabase.ts          # Supabase客户端
│   ├── prisma.ts            # Prisma客户端
│   ├── siliconflow.ts       # 硅基流动AI
│   ├── encryption.ts        # 数据加密
│   └── utils.ts             # 工具函数
├── data/                    # 静态数据
│   └── hanzi-data.ts        # 汉字数据
├── hooks/                   # React Hooks
│   └── use-toast.ts         # Toast通知
├── prisma/                  # Prisma配置
│   └── schema.prisma        # 数据库schema
├── public/                  # 静态资源
├── .env.local.example       # 环境变量示例
├── next.config.js           # Next.js配置
├── tailwind.config.ts       # Tailwind配置
├── tsconfig.json            # TypeScript配置
├── vercel.json              # Vercel配置
└── package.json             # 项目依赖
\`\`\`

## 🧪 测试

\`\`\`bash
# 运行测试
npm test

# 运行E2E测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage
\`\`\`

## 📊 数据库Schema

### 用户表 (users)
- id: 主键
- email: 邮箱（可选）
- pin: PIN码
- created_at: 创建时间
- updated_at: 更新时间

### 学习数据表 (learning_data)
- id: 主键
- user_id: 用户ID
- pinyin_practice: 拼音练习数据（加密）
- dictation_practice: 听写练习数据（加密）
- sound_game: 声音游戏数据（加密）
- mistakes_dictation: 听写错题（加密）
- mistakes_sound: 声音游戏错题（加密）
- statistics: 统计数据（加密）

### AI交互表 (ai_interactions)
- id: 主键
- user_id: 用户ID
- interaction_type: 交互类型
- input_data: 输入数据
- ai_response: AI响应
- model_used: 使用的模型
- tokens_used: Token使用量

### AI配额表 (ai_usage_quotas)
- id: 主键
- user_id: 用户ID
- date: 日期
- request_count: 请求次数

## 🔐 安全考虑

1. **数据加密**: 所有学习数据使用AES-256加密
2. **PIN码保护**: 使用PIN码而非传统密码
3. **RLS策略**: Supabase Row Level Security保护数据
4. **API密钥**: 环境变量存储，不提交到Git
5. **AI配额**: 限制每日AI请求次数防止滥用

## 🎯 开发路线图

### ✅ 已完成 (v2.0)
- [x] Next.js 14迁移
- [x] PIN码认证系统
- [x] 拼音/听写/声音游戏
- [x] 错题本功能
- [x] AI助手集成
- [x] 数据加密和云同步

### 🚧 开发中
- [ ] AI拼音纠错优化
- [ ] 语音识别准确度提升
- [ ] 更多汉字数据
- [ ] 学习路径个性化

### 📋 计划中
- [ ] 家长仪表板
- [ ] 学习报告导出
- [ ] 多人学习模式
- [ ] 离线学习支持
- [ ] 移动端APP

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork项目
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 开启Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [硅基流动](https://siliconflow.cn/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 联系方式

- 项目主页: [https://github.com/your-username/hanzi-learning](https://github.com/your-username/hanzi-learning)
- 问题反馈: [GitHub Issues](https://github.com/your-username/hanzi-learning/issues)

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
