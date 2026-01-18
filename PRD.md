# 快乐学汉字 AI 版 - 产品需求文档 (PRD)

**项目代号**: hanzi-learning-ai
**版本**: v2.0
**更新日期**: 2025-01-18
**产品类型**: 智能汉字学习平台
**目标用户**: 5-12岁儿童及中文学习者

---

## 📋 目录

1. [产品概述](#产品概述)
2. [现有功能总结](#现有功能总结)
3. [AI 增强功能规划](#ai-增强功能规划)
4. [技术架构设计](#技术架构设计)
5. [数据库设计](#数据库设计)
6. [开发计划](#开发计划)
7. [成本预算](#成本预算)
8. [风险与挑战](#风险与挑战)
9. [成功指标](#成功指标)
10. [后续扩展](#后续扩展)

---

## 产品概述

### 产品定位

一个面向儿童和中文学习者的智能汉字学习平台,结合 **硅基流动免费 AI 模型** 提供个性化学习体验。

### 核心价值主张

- ✅ **零成本 AI**: 使用硅基流动免费模型,无需承担 AI API 费用
- ✅ **智能学习**: AI 驱动的个性化学习路径和错误分析
- ✅ **全栈架构**: Next.js 14 + Supabase + Vercel,开发效率高
- ✅ **数据安全**: AES 加密 + Supabase RLS,保护儿童隐私
- ✅ **跨设备同步**: 云端数据同步,随时随地学习

### 技术栈

```yaml
前端框架: Next.js 14 (App Router)
后端: Next.js Server Actions + API Routes
数据库: Supabase (PostgreSQL)
身份认证: Supabase Auth
UI 组件: shadcn/ui + Tailwind CSS
AI 服务: 硅基流动 (SiliconFlow)
部署平台: Vercel 免费计划
版本控制: GitHub
ORM: Prisma
```

---

## 现有功能总结

### 当前应用功能 (基于 index.html 分析)

#### 1. 核心学习功能

**看字选拼音练习**
- 输入汉字/词组 (支持空格或逗号分隔)
- 显示拼音卡片 (使用 pinyin-pro 库)
- 实时练习输入拼音
- 即时验证正确性
- 点击听发音 (Web Speech API)

**听音选字练习**
- 语音播放汉字发音
- 4选1 游戏模式
- 进度追踪 (当前题数/总题数)
- 实时反馈 (正确/错误动画)
- 结果统计展示

**错题集管理**
- 分类错题集:
  - 看字选拼音错题
  - 听音选字错题
- 错题详情:
  - 错误次数统计
  - 最后错误时间
  - 正确答案显示
- 错题练习模式
- 单个错题移除功能
- 批量清空功能

**学习统计**
- 看字选拼音统计:
  - 错题数量
  - 累计错误次数
- 听音选字统计:
  - 错题数量
  - 累计错误次数
- 总体统计:
  - 已学字词数
  - 练习次数
  - 正确率
  - 总错题数量
- 已学字词列表

#### 2. 云端同步功能

**用户认证**
- 8位 PIN 码登录/注册
- Supabase Auth 认证
- JWT Token 管理
- 自动登录状态保持

**数据同步**
- 自动同步 (延迟 3 秒,避免频繁请求)
- 手动同步按钮
- 实时同步状态显示:
  - 未同步 (灰色)
  - 同步中 (蓝色动画)
  - 已同步 (绿色)
  - 同步失败 (红色)
- 跨设备数据一致性

**数据安全**
- AES-256 加密 (CryptoJS)
- PIN 码 bcrypt 哈希存储
- Row Level Security (RLS)
- 用户数据隔离

#### 3. UI/UX 设计

**响应式设计**
- 移动端优化 (< 768px)
- 平板和桌面端适配
- 触摸友好的交互

**视觉设计**
- 渐变背景 (紫色调)
- 卡片式布局
- 动画效果:
  - bounceIn (标题)
  - slideUp (卡片)
  - fadeIn (内容)
  - pulse (正确答案)
  - shake (错误答案)

**交互设计**
- 标签页切换 (4个功能区域)
- 实时输入验证
- 友好的错误提示
- 模态框登录流程

---

## AI 增强功能规划

### AI 服务提供商: 硅基流动 (SiliconFlow)

#### 为什么选择硅基流动?

✅ **免费模型充足**:
- Qwen/Qwen3-8B (完全免费)
- Qwen/Qwen2.5-7B-Instruct (完全免费)
- deepseek-ai/DeepSeek-R1-Distill-Qwen-7B (完全免费)
- THUDM/glm-4-9b-chat (完全免费)
- deepseek-ai/DeepSeek-OCR (完全免费)
- FunAudioLLM/SenseVoiceSmall (语音识别,完全免费)

✅ **性能优秀**:
- Qwen3-8B: 8B 参数,128K 上下文
- DeepSeek-R1-Distill: 推理能力强
- 响应速度: < 2 秒

✅ **无限制使用**:
- 无每日调用次数限制
- 无 Token 数量限制
- 适合个人项目和初创产品

#### 可用的免费模型

| 模型名称 | 类型 | 参数 | 用途 | 价格 |
|---------|------|------|------|------|
| **Qwen/Qwen3-8B** | 对话 | 8B | 通用对话、造句 | 免费 |
| **Qwen/Qwen2.5-7B-Instruct** | 对话 | 7B | 指令理解、纠错 | 免费 |
| **deepseek-ai/DeepSeek-R1-Distill-Qwen-7B** | 推理 | 7B | 错误分析、解释 | 免费 |
| **THUDM/glm-4-9b-chat** | 对话 | 9B | 自然对话 | 免费 |
| **deepseek-ai/DeepSeek-OCR** | OCR | 3B | 汉字识别 | 免费 |
| **FunAudioLLM/SenseVoiceSmall** | ASR | - | 语音识别 | 免费 |

### 阶段一: 智能 AI 助手 (MVP) - Week 3-5

#### 功能 1: AI 拼音纠错与解释

**需求描述**:
当学生在练习中拼错拼音时,AI 分析错误原因并给出个性化提示。

**AI 能力**:
- 语音学知识库 (声调、韵母、声母错误分析)
- 错误模式识别
- 儿童友好的解释语言

**技术实现**:
```typescript
// 模型选择: Qwen/Qwen2.5-7B-Instruct (免费)
// 估算成本: 免费

// API 调用示例
const pinyinFeedback = await generatePinyinFeedback({
  character: "天",
  userPinyin: "tian",  // 学生输入
  correctPinyin: "tiān",  // 正确答案
  errorType: "tone"  // 错误类型: 声调/韵母/声母
})

// AI 返回
{
  "analysis": "你把第一声记成了第四声",
  "hint": "第一声是高平调,像飞机平稳飞行 - ˉ",
  "encouragement": "再试一次!你一定行!",
  "practice": ["天", "仙", "边"]  // 同声调练习字
}
```

**用户价值**:
- 即时反馈,不需要等待家长/老师
- 理解错误原因,而不是死记硬背
- 建立学习信心

**实现优先级**: 🔴 高 (Week 3)

---

#### 功能 2: 智能组词造句

**需求描述**:
根据学习的汉字生成个性化、年龄适宜的组词和例句。

**AI 能力**:
- 自然语言生成
- 词汇难度分级
- 上下文理解

**技术实现**:
```typescript
// 模型选择: Qwen/Qwen3-8B (免费)
// 估算成本: 免费

const sentences = await generateSentences({
  characters: ["天", "地", "人"],
  difficulty: "beginner",  // beginner/intermediate/advanced
  age: 8,  // 学生年龄
  context: "daily_life"  // 语境: school, home, nature
})

// AI 返回
{
  "天": {
    "words": ["天空", "天气", "春天"],
    "sentences": [
      "今天天气很好,我想去公园玩。",
      "蓝蓝的天空上飘着白云。",
      "春天来了,花儿都开了。"
    ],
    "difficulty": "beginner"
  },
  "地": {
    "words": ["土地", "大地", "草地"],
    "sentences": [
      "农民伯伯在土地上种庄稼。",
      "大地像妈妈一样孕育生命。",
      "我们在草地上踢足球。"
    ],
    "difficulty": "beginner"
  }
}
```

**用户价值**:
- 学习汉字在实际语境中的应用
- 扩展词汇量
- 提升阅读理解能力

**实现优先级**: 🔴 高 (Week 4)

---

#### 功能 3: AI 学习路径推荐

**需求描述**:
基于错题数据和学习进度,智能推荐下一步学习内容。

**AI 能力**:
- 学习数据分析
- 薄弱知识点识别
- 个性化学习路径规划

**技术实现**:
```typescript
// 模型选择: deepseek-ai/DeepSeek-R1-Distill-Qwen-7B (免费)
// 推理能力强,适合分析

const recommendation = await recommendLearningPath({
  userId: "user_123",
  mistakes: {
    "天": { count: 5, lastWrong: "2025-01-18" },
    "风": { count: 3, lastWrong: "2025-01-17" }
  },
  learnedWords: ["人", "地", "水"],
  stats: {
    correctRate: 0.75,
    totalPractice: 50
  }
})

// AI 返回
{
  "focus_areas": [
    {
      "character": "天",
      "reason": "错误5次,建议重点练习声调",
      "practice_words": ["天", "仙", "边", "千"]
    },
    {
      "character": "风",
      "reason": "混淆声母 f 和 h",
      "practice_words": ["风", "飞", "灰", "饭"]
    }
  ],
  "daily_plan": {
    "new_words": ["云", "雨", "雪"],
    "review_words": ["天", "风"],
    "practice_count": 20
  },
  "encouragement": "你已经掌握了75%,继续加油!"
}
```

**用户价值**:
- 高效学习,不浪费时间
- 针对性练习薄弱环节
- 渐进式学习,避免挫败感

**实现优先级**: 🟡 中 (Week 5)

---

### 阶段二: 高级 AI 功能 - Week 6-8

#### 功能 4: AI 虚拟学习伙伴

**需求描述**:
24/7 在线的对话式学习助手,陪伴孩子学习。

**AI 能力**:
- 多轮对话管理
- 情感识别与鼓励
- 学习进度追踪

**技术实现**:
```typescript
// 模型选择: THUDM/glm-4-9b-chat (免费)
// 对话能力强

// 使用 Vercel AI SDK 实现流式响应
import { streamText } from 'ai'

const result = streamText({
  model: siliconflow('glm-4-9b-chat'),
  system: `你是小学汉字学习助手"小明老师"。
  特点:
  - 温暖耐心,像大哥哥/大姐姐
  - 用简单的语言解释复杂概念
  - 经常鼓励学生
  - 使用emoji让对话更生动`,
  messages: chatHistory
})

// 流式返回响应
```

**对话场景示例**:
```
学生: "我总是记不住'风'的拼音"
AI: "没关系呀!🌟 我们可以想想办法:
    1. '风'的拼音是 fēng,第一声高平调
    2. 你可以记:风吹树叶 ˉˉˉ
    3. 我们来练习5个带 fēng 的字好吗?
    要不要试试看? 💪"
```

**用户价值**:
- 随时随地提问,不用等家长
- 建立学习习惯
- 减少学习孤独感

**实现优先级**: 🟡 中 (Week 7)

---

#### 功能 5: 语音识别评估

**需求描述**:
学生朗读汉字,AI 评估发音准确度。

**技术实现**:
```typescript
// 模型选择: FunAudioLLM/SenseVoiceSmall (免费)
// 多语言语音识别

// 1. 录音
const audioBlob = await recordAudio()

// 2. 上传并识别
const result = await transcribeAudio(audioBlob)

// 3. 对比标准发音
const score = evaluatePronunciation({
  spoken: result.text,
  target: "天",
  pinyin: "tiān"
})

// 返回
{
  "score": 85,  // 发音得分
  "feedback": "声调很准确,但韵母要再张大嘴巴",
  "similarity": 0.9
}
```

**用户价值**:
- 自主练习发音
- 即时反馈
- 提升口语自信

**实现优先级**: 🟢 低 (Week 8)

---

#### 功能 6: 智能作文批改

**需求描述**:
学生用学过的汉字写短句,AI 批改并给出建议。

**技术实现**:
```typescript
// 模型选择: Qwen/Qwen3-8B (免费)

const feedback = await gradeComposition({
  text: "今天天起很好,我玩得很开欣。",
  learnedCharacters: ["今", "天", "玩", "得"]
})

// 返回
{
  "corrected_text": "今天天气很好,我玩得很开心。",
  "errors": [
    {
      "original": "天起",
      "correct": "天气",
      "reason": "用错字了"
    },
    {
      "original": "开欣",
      "correct": "开心",
      "reason": "偏旁错了"
    }
  ],
  "praise": ["句子通顺", "会使用'很'了!"],
  "suggestions": ["试试加入地点,比如在公园玩"]
}
```

**用户价值**:
- 巩固所学汉字
- 提升写作能力
- 培养表达习惯

**实现优先级**: 🟢 低 (Week 8)

---

## 技术架构设计

### 前端架构 (Next.js 14 App Router)

```
hanzi-learning-ai/
├── app/
│   ├── (auth)/                    # 认证相关页面
│   │   ├── login/
│   │   │   └── page.tsx          # PIN 码登录页
│   │   └── layout.tsx            # 认证布局
│   │
│   ├── (dashboard)/               # 主应用
│   │   ├── layout.tsx            # 仪表板布局 (需认证)
│   │   ├── page.tsx              # 首页 (学习入口)
│   │   ├── practice/
│   │   │   ├── page.tsx          # 练习页
│   │   │   └── [mode]/           # pinyin/sound
│   │   ├── mistakes/
│   │   │   └── page.tsx          # 错题集
│   │   ├── ai-tutor/
│   │   │   └── page.tsx          # AI 助手
│   │   └── stats/
│   │       └── page.tsx          # 学习统计
│   │
│   ├── api/                       # API Routes
│   │   ├── ai/
│   │   │   ├── pinyin-feedback/route.ts
│   │   │   ├── generate-sentences/route.ts
│   │   │   ├── recommend-learning/route.ts
│   │   │   ├── chat/route.ts
│   │   │   └── evaluate-pronunciation/route.ts
│   │   ├── auth/
│   │   │   └── callback/route.ts  # Supabase 回调
│   │   └── sync/
│   │       └── route.ts
│   │
│   ├── actions/                   # Server Actions
│   │   ├── learning.ts            # 学习数据操作
│   │   ├── auth.ts                # 认证操作
│   │   └── ai.ts                  # AI 交互
│   │
│   ├── _components/               # 共享组件
│   │   ├── ui/                    # shadcn/ui 组件
│   │   ├── practice-card.tsx
│   │   ├── ai-chat.tsx
│   │   ├── stats-panel.tsx
│   │   └── sync-status.tsx
│   │
│   ├── _lib/
│   │   ├── supabase.ts            # Supabase 客户端
│   │   ├── auth.ts                # 认证助手
│   │   ├── siliconflow.ts         # 硅基流动 API 封装
│   │   └── utils.ts
│   │
│   ├── layout.tsx                 # 根布局
│   ├── globals.css                # 全局样式
│   └── error.tsx                  # 错误处理
│
├── prisma/
│   ├── schema.prisma              # 数据库 Schema
│   └── migrations/                # 迁移文件
│
├── public/
│   └── fonts/                     # 汉字字体
│
├── components/                    # 客户端组件
├── lib/
├── types/
│   └── index.ts                   # TypeScript 类型
│
├── .env.local                     # 环境变量
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

### 后端架构

#### Server Actions (推荐使用)

```typescript
// app/actions/learning.ts
'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function saveMistake(
  userId: string,
  type: 'dictation' | 'sound',
  character: string,
  pinyin: string
) {
  // 1. 验证用户
  // 2. 保存错题
  // 3. 自动触发 AI 分析
  // 4. 重新验证缓存
  revalidatePath('/practice')
  revalidatePath('/mistakes')
}
```

#### API Routes (复杂操作)

```typescript
// app/api/ai/pinyin-feedback/route.ts
import { siliconflow } from '@/lib/siliconflow'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { character, userPinyin, correctPinyin } = await req.json()

  const result = streamText({
    model: siliconflow('qwen/Qwen2.5-7B-Instruct'),
    system: '你是专业的中文老师...',
    messages: [{
      role: 'user',
      content: `分析拼音错误: ${character}, 学生: ${userPinyin}, 正确: ${correctPinyin}`
    }],
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}
```

---

### AI 集成架构

#### 硅基流动 API 封装

```typescript
// lib/siliconflow.ts
import { createOpenAI } from '@ai-sdk/openai'

export const siliconflow = createOpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
})

// 可用的免费模型
export const MODELS = {
  QWEN_8B: 'Qwen/Qwen3-8B',                    // 完全免费
  QWEN_7B_INSTRUCT: 'Qwen/Qwen2.5-7B-Instruct', // 完全免费
  DEEPSEEK_R1_7B: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', // 完全免费
  GLM_9B: 'THUDM/glm-4-9b-chat',               // 完全免费
} as const

// 配额管理
export async function checkQuota(userId: string) {
  // 检查用户每日配额
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('ai_usage_quotas')
    .select('daily_requests, last_reset_date')
    .eq('user_id', userId)
    .single()

  if (!data || data.last_reset_date !== today) {
    // 新的一天,重置配额
    await supabase
      .from('ai_usage_quotas')
      .upsert({
        user_id: userId,
        daily_requests: 0,
        last_reset_date: today
      })
    return { allowed: true, remaining: 100 }
  }

  const remaining = 100 - data.daily_requests
  return {
    allowed: remaining > 0,
    remaining
  }
}
```

---

### 数据流设计

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面                               │
│  (React Components + shadcn/ui)                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server Actions                    │
│  - 身份验证                                                   │
│  - 数据校验                                                   │
│  - 权限检查                                                   │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Supabase 数据库    │      │  硅基流动 AI API      │
│  - PostgreSQL        │      │  - Qwen3-8B (免费)   │
│  - Auth              │      │  - DeepSeek-R1 (免费)│
│  - RLS 策略          │      │  - GLM-4-9B (免费)   │
└──────────────────────┘      └──────────────────────┘
          │                               │
          └───────────────┬───────────────┘
                          ▼
                  ┌─────────────────┐
                  │   数据聚合       │
                  │   + AI 分析     │
                  └─────────────────┘
                          │
                          ▼
                  ┌─────────────────┐
                  │   UI 更新        │
                  │  (React State)  │
                  └─────────────────┘
```

---

## 数据库设计

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== 用户表 ==========
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  pin           String?   // bcrypt 哈希后的 PIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  learningData  LearningData?
  aiInteractions AiInteraction[]
  learningPaths LearningPath[]
  aiUsageQuotas AiUsageQuota[]
}

// ========== 学习数据表 ==========
model LearningData {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])

  // 错题数据 (JSON 格式)
  // { "天": { count: 5, lastWrong: "2025-01-18T10:00:00Z", pinyin: "tian" } }
  mistakesDictation   Json?
  mistakesSound       Json?

  // 统计数据
  // { totalLearned: 100, totalPractice: 500, correctRate: 0.85 }
  stats               Json?

  // 已学字词列表
  learnedWords        String[]

  // AES 加密的完整数据 (云同步备份)
  encryptedData       String?

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// ========== AI 交互记录表 ==========
model AiInteraction {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  // 交互类型
  interactionType String   // 'pinyin_feedback', 'sentence_gen', 'chat', 'recommendation'

  // 输入输出数据
  inputData       Json
  aiResponse      Json

  // 使用的模型和 Token 消耗
  modelUsed       String
  tokensUsed      Int

  // 用户反馈 (可选)
  userRating      Int?     // 1-5 星
  userFeedback    String?

  createdAt       DateTime @default(now())

  @@index([userId, createdAt])
}

// ========== 学习路径表 ==========
model LearningPath {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])

  // AI 推荐的学习路径
  recommendedWords  String[]
  difficultyLevel   String   // 'beginner', 'intermediate', 'advanced'

  // 重点练习区域
  // { "tone_practice": ["天", "风"], "rhyme_practice": ["云", "雨"] }
  focusAreas        Json

  // 生成时间
  createdAt         DateTime @default(now())

  // 完成状态
  completedAt       DateTime?

  @@index([userId, createdAt])
}

// ========== AI 使用配额表 ==========
model AiUsageQuota {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  // 每日请求计数
  dailyRequests   Int      @default(0)

  // 上次重置日期
  lastResetDate   DateTime @default(now())

  // 订阅层级
  subscriptionTier String  @default("free") // 'free', 'premium'

  updatedAt       DateTime @updatedAt

  @@index([subscriptionTier])
}
```

---

### Supabase RLS 策略

```sql
-- 启用 RLS
ALTER TABLE user ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_quotas ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own data"
ON learning_data
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
ON learning_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
ON learning_data
FOR UPDATE
USING (auth.uid() = user_id);

-- AI 交互记录策略
CREATE POLICY "Users can view own AI interactions"
ON ai_interactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI interactions"
ON ai_interactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## 开发计划

### Week 1-2: 基础设施搭建

#### 任务清单

- [ ] **GitHub 仓库初始化**
  - 创建仓库 `hanzi-learning-ai`
  - 配置 `.gitignore` (Next.js 标准)
  - 创建分支保护规则
  - 设置 Issue 和 PR 模板

- [ ] **Next.js 项目创建**
  ```bash
  npx create-next-app@latest hanzi-learning-ai --typescript --tailwind --app
  cd hanzi-learning-ai
  ```

- [ ] **依赖安装**
  ```bash
  # 核心依赖
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  npm install @ai-sdk/openai ai  # Vercel AI SDK
  npm install prisma @prisma/client

  # UI 组件
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  npm install class-variance-authority clsx tailwind-merge
  npm install lucide-react

  # shadcn/ui
  npx shadcn-ui@latest init
  ```

- [ ] **Supabase 项目配置**
  - 创建 Supabase 项目
  - 执行数据库 Schema 迁移
  - 配置 RLS 策略
  - 获取 API 密钥

- [ ] **Prisma 配置**
  ```bash
  npx prisma init
  npx prisma migrate dev --name init
  npx prisma generate
  ```

- [ ] **环境变量配置**
  ```bash
  # .env.local
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  SILICONFLOW_API_KEY=your_siliconflow_key
  DATABASE_URL=your_database_url
  ```

- [ ] **基础路由和布局**
  - 创建 `(auth)` 和 `(dashboard)` 路由组
  - 实现根布局
  - 添加全局样式

---

### Week 3: AI 拼音纠错功能

#### 后端开发

- [ ] **创建 Server Action**
  ```typescript
  // app/actions/ai.ts
  export async function getPinyinFeedback(
    character: string,
    userPinyin: string,
    correctPinyin: string
  ) {
    // 1. 检查配额
    // 2. 调用硅基流动 API
    // 3. 返回流式响应
  }
  ```

- [ ] **硅基流动 API 集成**
  ```typescript
  // lib/siliconflow.ts
  import { createOpenAI } from '@ai-sdk/openai'

  export const siliconflow = createOpenAI({
    baseURL: 'https://api.siliconflow.cn/v1',
    apiKey: process.env.SILICONFLOW_API_KEY,
  })
  ```

#### 前端开发

- [ ] **AI 提示组件**
  ```typescript
  // components/ai-pinyin-hint.tsx
  'use client'

  export function AiPinyinHint({ character, userPinyin }) {
    const { data, error, isLoading } = useSWR(
      `/api/ai/pinyin-feedback?char=${character}&pinyin=${userPinyin}`,
      fetcher
    )

    if (isLoading) return <LoadingSpinner />
    if (error) return <ErrorMessage />

    return (
      <div className="ai-hint">
        <p>{data.analysis}</p>
        <p>{data.hint}</p>
        <p className="encouragement">{data.encouragement}</p>
      </div>
    )
  }
  ```

- [ ] **集成到练习界面**
  - 在练习卡片下方显示 AI 提示
  - 添加"显示提示"按钮
  - 错误时自动触发 AI 分析

---

### Week 4: 智能组词造句

#### 后端开发

- [ ] **造句生成 API**
  ```typescript
  // app/api/ai/generate-sentences/route.ts
  export async function POST(req: Request) {
    const { characters, difficulty, age } = await req.json()

    const result = await generateText({
      model: siliconflow('Qwen/Qwen3-8B'),
      prompt: `为 ${age} 岁学生生成 ${difficulty} 难度的例句...`,
    })

    return Response.json(result)
  }
  ```

- [ ] **缓存机制**
  ```typescript
  // 使用 Redis 或 Vercel KV
  const cacheKey = `sentences:${characters.join(',')}:${difficulty}`
  const cached = await cache.get(cacheKey)

  if (cached) return JSON.parse(cached)

  const generated = await generateSentences(...)
  await cache.set(cacheKey, JSON.stringify(generated), { ex: 3600 })
  ```

#### 前端开发

- [ ] **组词造句组件**
  ```typescript
  // components/sentence-generator.tsx
  export function SentenceGenerator({ characters }) {
    const [difficulty, setDifficulty] = useState('beginner')
    const { data, trigger } = useSWRMutation(
      '/api/ai/generate-sentences',
      fetcher
    )

    return (
      <div>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="beginner">简单</option>
          <option value="intermediate">中等</option>
          <option value="advanced">困难</option>
        </select>
        <button onClick={() => trigger({ characters, difficulty })}>
          生成例句
        </button>
        {data && <SentenceList data={data} />}
      </div>
    )
  }
  ```

---

### Week 5: 学习路径推荐

#### 数据分析模块

- [ ] **错题分析算法**
  ```typescript
  // lib/learning-analytics.ts
  export function analyzeMistakes(mistakes: Record<string, MistakeData>) {
    return {
      highFrequencyMistakes: Object.entries(mistakes)
        .filter(([_, data]) => data.count >= 5)
        .map(([char, _]) => char),

      recentMistakes: Object.entries(mistakes)
        .filter(([_, data]) => {
          const daysSince = (Date.now() - new Date(data.lastWrong).getTime()) / (1000 * 60 * 60 * 24)
          return daysSince <= 7
        })
        .map(([char, _]) => char),
    }
  }
  ```

- [ ] **AI 推荐引擎**
  ```typescript
  // app/api/ai/recommend-learning/route.ts
  export async function POST(req: Request) {
    const { userId, mistakes, stats } = await req.json()

    const analysis = analyzeMistakes(mistakes)

    const result = await generateText({
      model: siliconflow('deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'),
      prompt: `基于以下学习数据生成推荐路径...`,
    })

    // 保存到数据库
    await saveLearningPath(userId, result)

    return Response.json(result)
  }
  ```

#### 前端实现

- [ ] **今日推荐面板**
  ```typescript
  // components/daily-recommendation.tsx
  export function DailyRecommendation() {
    const { data } = useSWR('/api/ai/recommend-learning')

    return (
      <Card>
        <CardHeader>
          <CardTitle>📅 今日学习计划</CardTitle>
        </CardHeader>
        <CardContent>
          <WordList words={data.focus_areas} />
          <Button onClick={() => startPractice(data.recommended_words)}>
            开始练习
          </Button>
        </CardContent>
      </Card>
    )
  }
  ```

---

### Week 6-7: AI 学习伙伴

#### 对话界面

- [ ] **聊天 UI 组件**
  ```typescript
  // components/ai-chat.tsx
  import { useChat } from 'ai/react'

  export function AiChat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
      api: '/api/ai/chat',
    })

    return (
      <div className="chat-container">
        <MessageList messages={messages} />
        <form onSubmit={handleSubmit}>
          <input value={input} onChange={handleInputChange} />
          <button type="submit">发送</button>
        </form>
      </div>
    )
  }
  ```

- [ ] **流式响应 API**
  ```typescript
  // app/api/ai/chat/route.ts
  import { streamText } from 'ai'
  import { siliconflow } from '@/lib/siliconflow'

  export async function POST(req: Request) {
    const { messages } = await req.json()

    const result = streamText({
      model: siliconflow('THUDM/glm-4-9b-chat'),
      system: `你是小学汉字学习助手"小明老师"...`,
      messages,
    })

    return result.toDataStreamResponse()
  }
  ```

#### 上下文管理

- [ ] **对话历史存储**
  ```typescript
  // 保存到 Supabase
  await supabase.from('ai_interactions').insert({
    user_id: userId,
    interaction_type: 'chat',
    input_data: { lastMessage: messages[messages.length - 1] },
    ai_response: { reply },
  })
  ```

---

### Week 8: 高级功能

#### 语音识别评估

- [ ] **录音组件**
  ```typescript
  // components/audio-recorder.tsx
  export function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorder = useRef<MediaRecorder>()

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.start()
      setIsRecording(true)
    }

    const stopRecording = () => {
      mediaRecorder.current?.stop()
      setIsRecording(false)
    }

    return (
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '⏹️ 停止' : '🎤 开始录音'}
      </Button>
    )
  }
  ```

- [ ] **语音识别 API**
  ```typescript
  // app/api/ai/evaluate-pronunciation/route.ts
  export async function POST(req: Request) {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    // 使用硅基流动的语音识别模型
    const transcription = await transcribeAudio(audioFile)

    // 评估发音
    const score = evaluatePronunciation(transcription, target)

    return Response.json(score)
  }
  ```

---

### Week 9-10: 优化与测试

#### 性能优化

- [ ] **API 调用优化**
  - 实现智能缓存 (减少 50% API 调用)
  - 批量处理请求
  - 优化 prompt 长度

- [ ] **前端性能**
  - 代码分割
  - 图片优化
  - 懒加载

#### 测试

- [ ] **单元测试**
  ```bash
  npm install -D vitest @testing-library/react
  ```

- [ ] **E2E 测试**
  ```bash
  npm install -D playwright
  ```

---

## 成本预算

### 免费额度分析

| 服务 | 免费额度 | 预计使用 | 超限费用 |
|------|---------|---------|---------|
| **Vercel** | 100GB 带宽/月 | ~30GB | $20/100GB |
| **Supabase** | 500MB DB + 50K MAU | ~200MB + 1K MAU | $25/月起 |
| **硅基流动 AI** | 多个免费模型 | ~100K 请求/月 | **完全免费** |

### AI API 成本

**使用硅基流动免费模型,成本为 ¥0**

```yaml
免费模型:
  - Qwen/Qwen3-8B: 免费
  - Qwen/Qwen2.5-7B-Instruct: 免费
  - deepseek-ai/DeepSeek-R1-Distill-Qwen-7B: 免费
  - THUDM/glm-4-9b-chat: 免费

预估使用量:
  - 日活用户: 1000
  - 每人每天 AI 交互: 10 次
  - 每月总请求: 300,000 次

成本: ¥0/月
```

**对比 OpenAI**:
- GPT-4o-mini: ~$60-100/月
- 硅基流动: **$0/月** 💰

### 唯一可能的成本

1. **Vercel 超限**: 只有超过 100GB 带宽才收费
   - 优化: 图片用 Supabase Storage,启用 Vercel Edge Network

2. **Supabase 超限**: 超过 50K MAU 才收费
   - 对于个人学习应用,几乎不可能超限

**结论**: 整个项目可以做到 **完全免费运营**! 🎉

---

## 风险与挑战

### 技术风险

#### 1. AI 响应延迟
**风险**: 免费模型可能响应较慢 (2-5 秒)

**解决方案**:
- 使用 Vercel AI SDK 的流式响应
- 添加加载动画和骨架屏
- 实现智能缓存 (常见问题提前缓存)

```typescript
// 流式响应示例
const { text, error } = await streamText({
  model: siliconflow('Qwen/Qwen3-8B'),
  prompt,
}).toStreamResponse()

// 前端实时显示
```

#### 2. AI 准确性
**风险**: 生成内容可能有误

**解决方案**:
- 设计严格的 prompt 模板
- 添加内容验证层
- 提供"反馈"按钮,用户可标记错误

#### 3. 并发限制
**风险**: 虽然免费模型无限制,但服务器可能有隐含限制

**解决方案**:
- 实现请求队列
- 添加重试机制
- 监控 API 调用成功率

---

### 产品风险

#### 1. 儿童使用门槛
**风险**: 8 岁以下儿童可能不会打字

**解决方案**:
- UI 设计简洁,大按钮
- 支持语音输入
- 家长模式设置

#### 2. AI 依赖过度
**风险**: 学生可能只依赖 AI 提示,不思考

**解决方案**:
- 限制每日 AI 调用次数
- 要求先尝试,再查看提示
- AI 提示采用渐进式提示 (先给小 hint,再给答案)

---

### 安全风险

#### 1. 儿童隐私保护
**风险**: 违反 COPPA (儿童在线隐私保护法)

**解决方案**:
- 数据匿名化存储
- 不收集个人信息
- PIN 码认证,无需邮箱
- AES 加密所有数据

#### 2. API 密钥泄露
**风险**: 硅基流动 API Key 暴露

**解决方案**:
- 使用环境变量
- Server Actions 中调用 (不在前端)
- Vercel 环境变量加密存储

---

## 成功指标

### 用户指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| **DAU (日活用户)** | 1000+ | Vercel Analytics |
| **留存率** | 次日 60%, 7日 40% | Supabase 查询 |
| **学习时长** | 平均 20 分钟/天 | 前端埋点 |
| **用户满意度** | 4.5/5.0 | 评分系统 |

### AI 功能指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| **AI 功能使用率** | 80% 用户使用 | 数据库查询 |
| **AI 建议采纳率** | 70% | 反馈数据 |
| **AI 响应时间** | < 3 秒 (P95) | Vercel Logs |
| **AI 准确性** | > 90% 满意度 | 用户评分 |

### 学习效果指标

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| **错题减少率** | 7天内减少 50% | 错题数据对比 |
| **学习效率** | 比传统方式快 30% | A/B 测试 |
| **知识保留率** | 30天后保留 80% | 间隔重复测试 |

---

## 后续扩展

### 功能扩展

#### 1. 多语言支持
- 英文界面 (国际版)
- 拼音学习 (针对外国人)
- HSK 考试准备

#### 2. AR 汉字书写
- 使用手机摄像头
- 实时笔画纠正
- 书写评分

#### 3. 社交学习功能
- 学习排行榜
- 好友挑战
- 学习小组

#### 4. 家长仪表板
- 学习报告 (周报/月报)
- 进度可视化
- 学习建议

---

### 商业模式

#### 免费版 (当前)
- ✅ 基础学习功能
- ✅ 硅基流动免费 AI 模型
- ✅ 云端数据同步
- ✅ 每日 100 次 AI 调用

#### 付费版 ($9.99/月)
- 🚀 高级 AI 模型 (DeepSeek-V3.2)
- 🚀 无限 AI 调用
- 🚀 专属 AI 导师
- 🚀 学习报告导出
- 🚀 优先客服支持

#### 家庭版 ($14.99/月)
- 👨‍👩‍👧‍👦 支持 3 个账户
- 📊 家长仪表板
- 🎯 个性化学习计划
- 💬 专属学习顾问

---

## 附录

### A. 技术选型对比

#### 为什么 Next.js 而非 Vite?

| 特性 | Next.js | Vite + React |
|------|---------|--------------|
| **Server Actions** | ✅ 原生支持 | ❌ 需要自己实现 |
| **Vercel 部署** | ✅ 零配置 | ⚠️ 需要配置 |
| **SSR/SSG** | ✅ 开箱即用 | ⚠️ 需要额外配置 |
| **API Routes** | ✅ 内置 | ❌ 需要单独后端 |
| **学习曲线** | 中等 | 简单 |

**结论**: 对于需要后端和 AI 集成的项目,Next.js 更合适。

#### 为什么 Supabase 而非 Firebase?

| 特性 | Supabase | Firebase |
|------|----------|----------|
| **数据库** | PostgreSQL (SQL) | NoSQL |
| **免费额度** | 500MB + 50K MAU | 1GB (但限制更多) |
| **开源** | ✅ 是 | ❌ 否 |
| **SQL 支持** | ✅ | ❌ |
| **迁移难度** | 容易 | 困难 (厂商锁定) |

**结论**: Supabase 更灵活,不被厂商锁定。

#### 为什么硅基流动而非 OpenAI?

| 特性 | 硅基流动 | OpenAI |
|------|---------|--------|
| **免费模型** | ✅ 多个 | ❌ 仅 $5 额度 |
| **中文能力** | ✅ Qwen/DeepSeek 专为中文优化 | ⚠️ 通用 |
| **价格** | ¥0 (免费模型) | ~$60/月 |
| **响应速度** | < 2 秒 | < 1 秒 |
| **稳定性** | 新兴厂商 | 成熟稳定 |

**结论**: 对于个人项目,硅基流动免费模型完全够用!

---

### B. 环境变量清单

```bash
# .env.local

# ========== Supabase ==========
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ========== 硅基流动 ==========
SILICONFLOW_API_KEY=sk-xxxxx

# ========== 数据库 ==========
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

# ========== 应用 ==========
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### C. 常用命令

```bash
# ========== 开发 ==========
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# ========== 数据库 ==========
npx prisma migrate dev   # 开发环境迁移
npx prisma migrate prod  # 生产环境迁移
npx prisma generate      # 生成 Prisma Client
npx prisma studio        # 数据库可视化管理

# ========== 部署 ==========
vercel                   # 部署到 Vercel
vercel --prod            # 部署到生产环境

# ========== 代码质量 ==========
npm run lint             # ESLint 检查
npm run type-check       # TypeScript 类型检查
```

---

### D. 参考资料

#### 官方文档
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [硅基流动文档](https://siliconflow.cn/docs)

#### 教程
- [Next.js 14 全栈开发教程](https://nextjs.org/learn)
- [Supabase Auth 快速开始](https://supabase.com/docs/guides/auth)
- [shadcn/ui 组件库](https://ui.shadcn.com)

#### 社区
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Vercel Discord](https://vercel.com/discord)

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2025-01-18 | 更新 AI 服务为硅基流动,重新规划功能 | Claude |
| v1.0 | 2025-01-17 | 初始版本 (基于现有代码分析) | Claude |

---

**文档结束**

如有疑问,请联系项目维护者或提交 GitHub Issue。
