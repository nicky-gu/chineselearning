import { MODELS, type ModelType } from '@/lib/siliconflow'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    aiInteraction: {
      create: jest.fn(),
    },
    aiUsageQuota: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

// Mock environment variable
process.env.SILICONFLOW_API_KEY = 'test-api-key'

import { logAIInteraction, checkAIQuota } from '@/lib/siliconflow'

describe('SiliconFlow Utils', () => {
  const { prisma } = require('@/lib/prisma')
  const mockUserId = 'test-user-id'
  const mockDate = new Date('2025-01-18T00:00:00.000Z')

  beforeEach(function clearMocks() {
    jest.clearAllMocks()
  })

  describe('MODELS constant', () => {
    it('should have all required models', function testModelsDefined() {
      expect(MODELS.QWEN_8B).toBe('Qwen/Qwen3-8B')
      expect(MODELS.QWEN_7B_INSTRUCT).toBe('Qwen/Qwen2.5-7B-Instruct')
      expect(MODELS.DEEPSEEK_R1_7B).toBe('deepseek-ai/DeepSeek-R1-Distill-Qwen-7B')
      expect(MODELS.GLM_9B).toBe('THUDM/glm-4-9b-chat')
      expect(MODELS.DEEPSEEK_OCR).toBe('deepseek-ai/DeepSeek-OCR')
      expect(MODELS.SENSE_VOICE).toBe('FunAudioLLM/SenseVoiceSmall')
    })

    it('should be readonly', function testModelsReadonly() {
      const originalQwen8B = MODELS.QWEN_8B

      expect(() => {
        (MODELS as any).QWEN_8B = 'different-model'
      }).not.toThrow()

      expect(MODELS.QWEN_8B).toBe(originalQwen8B)
    })
  })

  describe('ModelType', () => {
    it('should accept valid model values', function testModelType() {
      const validModels: ModelType[] = [
        MODELS.QWEN_8B,
        MODELS.QWEN_7B_INSTRUCT,
        MODELS.DEEPSEEK_R1_7B,
        MODELS.GLM_9B,
      ]

      validModels.forEach((model) => {
        expect(model).toBeDefined()
        expect(typeof model).toBe('string')
      })
    })
  })

  describe('logAIInteraction', () => {
    const mockLogData = {
      userId: mockUserId,
      interactionType: 'test',
      inputData: { prompt: 'test' },
      aiResponse: { result: 'success' },
      modelUsed: MODELS.QWEN_8B,
      tokensUsed: 100,
    }

    it('should log AI interaction successfully', async function testLogInteraction() {
      prisma.aiInteraction.create.mockResolvedValue({ id: 'test-id' })
      prisma.aiUsageQuota.upsert.mockResolvedValue({})

      await expect(logAIInteraction(mockLogData)).resolves.not.toThrow()

      expect(prisma.aiInteraction.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          interactionType: 'test',
          inputData: { prompt: 'test' },
          aiResponse: { result: 'success' },
          modelUsed: MODELS.QWEN_8B,
          tokensUsed: 100,
        },
      })
    })

    it('should update usage quota', async function testLogQuota() {
      prisma.aiInteraction.create.mockResolvedValue({ id: 'test-id' })
      prisma.aiUsageQuota.upsert.mockResolvedValue({})

      await logAIInteraction(mockLogData)

      expect(prisma.aiUsageQuota.upsert).toHaveBeenCalledWith({
        where: {
          userId_date: {
            userId: mockUserId,
            date: expect.any(Date),
          },
        },
        create: {
          userId: mockUserId,
          date: expect.any(Date),
          requestCount: 1,
        },
        update: {
          requestCount: {
            increment: 1,
          },
        },
      })
    })

    it('should handle default tokensUsed', async function testLogDefaultTokens() {
      const logWithoutTokens = { ...mockLogData, tokensUsed: undefined }
      prisma.aiInteraction.create.mockResolvedValue({ id: 'test-id' })
      prisma.aiUsageQuota.upsert.mockResolvedValue({})

      await logAIInteraction(logWithoutTokens)

      expect(prisma.aiInteraction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tokensUsed: 0,
        }),
      })
    })

    it('should handle database errors gracefully', async function testLogError() {
      const error = new Error('Database error')
      prisma.aiInteraction.create.mockRejectedValue(error)

      await expect(logAIInteraction(mockLogData)).resolves.not.toThrow()
    })
  })

  describe('checkAIQuota', () => {
    it('should return true when no quota exists', async function testQuotaNone() {
      prisma.aiUsageQuota.findUnique.mockResolvedValue(null)

      const result = await checkAIQuota(mockUserId)

      expect(result).toBe(true)
      expect(prisma.aiUsageQuota.findUnique).toHaveBeenCalledWith({
        where: {
          userId_date: {
            userId: mockUserId,
            date: expect.any(Date),
          },
        },
      })
    })

    it('should return true when under daily limit', async function testQuotaUnderLimit() {
      prisma.aiUsageQuota.findUnique.mockResolvedValue({
        requestCount: 50,
      })

      const result = await checkAIQuota(mockUserId)

      expect(result).toBe(true)
    })

    it('should return false when at daily limit', async function testQuotaAtLimit() {
      prisma.aiUsageQuota.findUnique.mockResolvedValue({
        requestCount: 100,
      })

      const result = await checkAIQuota(mockUserId)

      expect(result).toBe(false)
    })

    it('should return false when over daily limit', async function testQuotaOverLimit() {
      prisma.aiUsageQuota.findUnique.mockResolvedValue({
        requestCount: 150,
      })

      const result = await checkAIQuota(mockUserId)

      expect(result).toBe(false)
    })

    it('should handle database errors gracefully', async function testQuotaError() {
      prisma.aiUsageQuota.findUnique.mockRejectedValue(new Error('Database error'))

      const result = await checkAIQuota(mockUserId)

      expect(result).toBe(false)
    })
  })
})
