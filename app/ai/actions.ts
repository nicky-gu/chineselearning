'use server'

import { siliconflow, MODELS, logAIInteraction, checkAIQuota } from '@/lib/siliconflow'
import { streamText } from 'ai'

export async function checkPinyinCorrection(hanzi: string, userPinyin: string, userId: string) {
  // 检查配额
  const hasQuota = await checkAIQuota(userId)
  if (!hasQuota) {
    return {
      success: false,
      error: '今日AI请求次数已达上限，请明天再试',
    }
  }

  try {
    const prompt = `请检查以下汉字的拼音是否正确。如果正确，说明正确。如果错误，请指出错误并给出正确答案。

汉字: ${hanzi}
用户输入的拼音: ${userPinyin}

请用中文简洁回答，格式如下：
- 如果正确：✓ 正确！[汉字]的拼音是[拼音]
- 如果错误：✗ 不正确。[汉字]的正确拼音是[拼音]，您的发音需要注意[具体建议]`

    const result = await streamText({
      model: siliconflow(MODELS.QWEN_7B_INSTRUCT),
      prompt,
      temperature: 0.3,
    })

    // 记录AI交互
    await logAIInteraction({
      userId,
      interactionType: 'pinyin_correction',
      inputData: { hanzi, userPinyin },
      aiResponse: { status: 'streaming' },
      modelUsed: MODELS.QWEN_7B_INSTRUCT,
    })

    return {
      success: true,
      stream: result.toDataStream(),
    }
  } catch (error) {
    console.error('Pinyin correction error:', error)
    return {
      success: false,
      error: '拼音检查失败，请稍后重试',
    }
  }
}

export async function generateWords(hanzi: string, userId: string) {
  const hasQuota = await checkAIQuota(userId)
  if (!hasQuota) {
    return {
      success: false,
      error: '今日AI请求次数已达上限，请明天再试',
    }
  }

  try {
    const prompt = `请为汉字"${hanzi}"生成5-8个常用词语。要求：
1. 词语必须是常用且适合小学生学习的
2. 包含词语的拼音
3. 每个词语后面标注难易程度（简单/中等/较难）
4. 按难易程度从易到难排列

格式示例：
1. [词语] ([拼音]) - [难易程度]

请只返回词语列表，不要其他内容。`

    const result = await streamText({
      model: siliconflow(MODELS.QWEN_8B),
      prompt,
      temperature: 0.7,
    })

    await logAIInteraction({
      userId,
      interactionType: 'word_generation',
      inputData: { hanzi },
      aiResponse: { status: 'streaming' },
      modelUsed: MODELS.QWEN_8B,
    })

    return {
      success: true,
      stream: result.toDataStream(),
    }
  } catch (error) {
    console.error('Word generation error:', error)
    return {
      success: false,
      error: '词语生成失败，请稍后重试',
    }
  }
}

export async function generateSentence(word: string, userId: string) {
  const hasQuota = await checkAIQuota(userId)
  if (!hasQuota) {
    return {
      success: false,
      error: '今日AI请求次数已达上限，请明天再试',
    }
  }

  try {
    const prompt = `请用词语"${word}"造3个句子。要求：
1. 句子简单易懂，适合小学生理解
2. 展示词语的不同用法和语境
3. 每个句子后面标注拼音
4. 句子要有教育意义或生活气息

格式：
1. [句子] ([拼音])
   [简短的词语用法说明]

请只返回句子列表，不要其他内容。`

    const result = await streamText({
      model: siliconflow(MODELS.QWEN_8B),
      prompt,
      temperature: 0.8,
    })

    await logAIInteraction({
      userId,
      interactionType: 'sentence_generation',
      inputData: { word },
      aiResponse: { status: 'streaming' },
      modelUsed: MODELS.QWEN_8B,
    })

    return {
      success: true,
      stream: result.toDataStream(),
    }
  } catch (error) {
    console.error('Sentence generation error:', error)
    return {
      success: false,
      error: '造句失败，请稍后重试',
    }
  }
}

export async function chatWithAI(message: string, conversationHistory: any[], userId: string) {
  const hasQuota = await checkAIQuota(userId)
  if (!hasQuota) {
    return {
      success: false,
      error: '今日AI请求次数已达上限，请明天再试',
    }
  }

  try {
    const systemPrompt = `你是一位专业的小学汉字学习AI助手。你的职责是：

1. 帮助学生学习汉字拼音和发音
2. 解答学习相关的疑问
3. 提供学习方法和建议
4. 鼓励学生，保持积极正向的态度
5. 用简单易懂的语言回答，适合小学生理解

回答风格：
- 友好、耐心、鼓励性
- 简洁明了，避免长篇大论
- 必要时使用emoji增加趣味性
- 如果不确定答案，诚实告知并建议其他学习方式

请始终保持专业和友善的态度。`

    const result = await streamText({
      model: siliconflow(MODELS.GLM_9B),
      system: systemPrompt,
      messages: conversationHistory,
      temperature: 0.7,
    })

    await logAIInteraction({
      userId,
      interactionType: 'chat',
      inputData: { message, conversationHistory },
      aiResponse: { status: 'streaming' },
      modelUsed: MODELS.GLM_9B,
    })

    return {
      success: true,
      stream: result.toDataStream(),
    }
  } catch (error) {
    console.error('Chat error:', error)
    return {
      success: false,
      error: '对话失败，请稍后重试',
    }
  }
}

export async function analyzeLearningProgress(userId: string) {
  try {
    // 获取用户的学习数据
    const { prisma } = await import('@/lib/prisma')
    const learningData = await prisma.learningData.findUnique({
      where: { userId },
    })

    if (!learningData) {
      return {
        success: false,
        error: '未找到学习数据',
      }
    }

    const stats = learningData.statistics || {}
    const prompt = `请分析以下学生学习数据，提供个性化学习建议：

总练习次数: ${stats.totalPractice || 0}
正确次数: ${stats.correctCount || 0}
错误次数: ${stats.wrongCount || 0}
正确率: ${stats.totalPractice ? ((stats.correctCount / stats.totalPractice) * 100).toFixed(1) : 0}%

请提供：
1. 学习评估（进步程度、掌握水平）
2. 优势分析
3. 需要改进的地方
4. 具体的学习建议（3-5条）
5. 鼓励的话

用中文简洁回答，语气鼓励。`

    const result = await streamText({
      model: siliconflow(MODELS.DEEPSEEK_R1_7B),
      prompt,
      temperature: 0.5,
    })

    await logAIInteraction({
      userId,
      interactionType: 'progress_analysis',
      inputData: stats,
      aiResponse: { status: 'streaming' },
      modelUsed: MODELS.DEEPSEEK_R1_7B,
    })

    return {
      success: true,
      stream: result.toDataStream(),
    }
  } catch (error) {
    console.error('Progress analysis error:', error)
    return {
      success: false,
      error: '学习进度分析失败，请稍后重试',
    }
  }
}
