'use server'

import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { encryptData, decryptData } from '@/lib/encryption'

export interface AuthResult {
  success: boolean
  error?: string
  userId?: string
}

export async function authenticateWithPin(pin: string): Promise<AuthResult> {
  try {
    // 验证PIN格式（8位数字）
    if (!/^\d{8}$/.test(pin)) {
      return {
        success: false,
        error: 'PIN码必须是8位数字',
      }
    }

    // 使用PIN码作为邮箱和密码登录Supabase
    const email = `pin_${pin}@hanzi-learning.internal`

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    })

    if (authError) {
      // 如果用户不存在，尝试注册
      if (authError.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: pin,
        })

        if (signUpError) {
          return {
            success: false,
            error: '注册失败: ' + signUpError.message,
          }
        }

        if (signUpData.user) {
          // 在数据库中创建用户记录
          await prisma.user.create({
            data: {
              id: signUpData.user.id,
              email: signUpData.user.email,
              pin: pin,
            },
          })

          // 创建初始学习数据
          await prisma.learningData.create({
            data: {
              userId: signUpData.user.id,
              pinyinPractice: {},
              dictationPractice: {},
              soundGame: {},
              mistakesDictation: {},
              mistakesSound: {},
              statistics: {
                totalPractice: 0,
                correctCount: 0,
                wrongCount: 0,
                startDate: new Date().toISOString(),
              },
            },
          })

          return {
            success: true,
            userId: signUpData.user.id,
          }
        }
      }

      return {
        success: false,
        error: '认证失败: ' + authError.message,
      }
    }

    if (authData.user) {
      // 确保数据库中有用户记录
      const user = await prisma.user.findUnique({
        where: { id: authData.user.id },
      })

      if (!user) {
        await prisma.user.create({
          data: {
            id: authData.user.id,
            email: authData.user.email,
            pin: pin,
          },
        })
      }

      return {
        success: true,
        userId: authData.user.id,
      }
    }

    return {
      success: false,
      error: '认证失败',
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: '系统错误，请稍后重试',
    }
  }
}

export async function syncLearningData(userId: string, pin: string, data: any) {
  try {
    const encryptedData = encryptData(data, pin)

    const { error } = await supabase
      .from('learning_data')
      .update({
        pinyin_practice: encryptedData.pinyinPractice || {},
        dictation_practice: encryptedData.dictationPractice || {},
        sound_game: encryptedData.soundGame || {},
        mistakes_dictation: encryptedData.mistakesDictation || {},
        mistakes_sound: encryptedData.mistakesSound || {},
        statistics: encryptedData.statistics || {},
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Sync error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sync error:', error)
    return { success: false, error: '同步失败' }
  }
}

export async function getLearningData(userId: string, pin: string) {
  try {
    const { data, error } = await supabase
      .from('learning_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const decryptedData = {
      pinyinPractice: decryptData(data.pinyin_practice as string, pin) || {},
      dictationPractice: decryptData(data.dictation_practice as string, pin) || {},
      soundGame: decryptData(data.sound_game as string, pin) || {},
      mistakesDictation: decryptData(data.mistakes_dictation as string, pin) || {},
      mistakesSound: decryptData(data.mistakes_sound as string, pin) || {},
      statistics: decryptData(data.statistics as string, pin) || {
        totalPractice: 0,
        correctCount: 0,
        wrongCount: 0,
        startDate: new Date().toISOString(),
      },
    }

    return { success: true, data: decryptedData }
  } catch (error) {
    console.error('Get learning data error:', error)
    return { success: false, error: '获取数据失败' }
  }
}

export async function saveMistake(
  userId: string,
  type: 'dictation' | 'sound',
  character: string,
  pinyin: string
) {
  try {
    const { data, error } = await supabase
      .from('learning_data')
      .select(type === 'dictation' ? 'mistakes_dictation' : 'mistakes_sound')
      .eq('user_id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const mistakesField = type === 'dictation' ? 'mistakes_dictation' : 'mistakes_sound'
    const mistakes = data[mistakesField] || {}

    mistakes[character] = {
      count: (mistakes[character]?.count || 0) + 1,
      pinyin,
      lastWrong: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('learning_data')
      .update({ [mistakesField]: mistakes, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Save mistake error:', error)
    return { success: false, error: '保存错题失败' }
  }
}

export async function updateStatistics(userId: string, correct: boolean) {
  try {
    const { data, error } = await supabase
      .from('learning_data')
      .select('statistics')
      .eq('user_id', userId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    const stats = data.statistics || {
      totalPractice: 0,
      correctCount: 0,
      wrongCount: 0,
      startDate: new Date().toISOString(),
    }

    stats.totalPractice += 1
    if (correct) {
      stats.correctCount += 1
    } else {
      stats.wrongCount += 1
    }

    const { error: updateError } = await supabase
      .from('learning_data')
      .update({ statistics: stats, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Update statistics error:', error)
    return { success: false, error: '更新统计失败' }
  }
}
