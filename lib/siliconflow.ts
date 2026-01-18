import { createOpenAI } from '@ai-sdk/openai'

const DAILY_REQUEST_LIMIT = 100

export const siliconflow = createOpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
})

export const MODELS = {
  QWEN_8B: 'Qwen/Qwen3-8B',
  QWEN_7B_INSTRUCT: 'Qwen/Qwen2.5-7B-Instruct',
  DEEPSEEK_R1_7B: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
  GLM_9B: 'THUDM/glm-4-9b-chat',
  DEEPSEEK_OCR: 'deepseek-ai/DeepSeek-OCR',
  SENSE_VOICE: 'FunAudioLLM/SenseVoiceSmall',
} as const

export type ModelType = typeof MODELS[keyof typeof MODELS]

export interface AIInteractionLog {
  userId: string
  interactionType: string
  inputData: unknown
  aiResponse: unknown
  modelUsed: ModelType
  tokensUsed?: number
}

export async function logAIInteraction(log: AIInteractionLog): Promise<void> {
  const { prisma } = await import('@/lib/prisma')

  await prisma.aiInteraction.create({
    data: {
      userId: log.userId,
      interactionType: log.interactionType,
      inputData: log.inputData,
      aiResponse: log.aiResponse,
      modelUsed: log.modelUsed,
      tokensUsed: log.tokensUsed ?? 0,
    },
  })

  const today = new Date()
  await prisma.aiUsageQuota.upsert({
    where: {
      userId_date: {
        userId: log.userId,
        date: today,
      },
    },
    create: {
      userId: log.userId,
      date: today,
      requestCount: 1,
    },
    update: {
      requestCount: {
        increment: 1,
      },
    },
  })
}

export async function checkAIQuota(userId: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma')
  const today = new Date()

  const quota = await prisma.aiUsageQuota.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })

  if (!quota) {
    return true
  }

  return quota.requestCount < DAILY_REQUEST_LIMIT
}
