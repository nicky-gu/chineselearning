'use server'

import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { encryptData, decryptData } from '@/lib/encryption'

const PIN_REGEX = /^\d{8}$/
const INTERNAL_EMAIL_DOMAIN = '@hanzi-learning.internal'

export interface AuthResult {
  success: boolean
  error?: string
  userId?: string
}

export async function authenticateWithPin(pin: string): Promise<AuthResult> {
  if (!PIN_REGEX.test(pin)) {
    return {
      success: false,
      error: 'PIN码必须是8位数字',
    }
  }

  const email = `pin_${pin}${INTERNAL_EMAIL_DOMAIN}`
  const authResult = await supabase.auth.signInWithPassword({
    email,
    password: pin,
  })

  if (authResult.error) {
    return handleAuthError(authResult.error, email, pin)
  }

  if (authResult.data.user) {
    await ensureUserExists(authResult.data.user.id, authResult.data.user.email, pin)

    return {
      success: true,
      userId: authResult.data.user.id,
    }
  }

  return {
    success: false,
    error: '认证失败',
  }
}

async function handleAuthError(error: Error, email: string, pin: string): Promise<AuthResult> {
  if (!error.message.includes('Invalid login credentials')) {
    return {
      success: false,
      error: `认证失败: ${error.message}`,
    }
  }

  const signUpResult = await supabase.auth.signUp({
    email,
    password: pin,
  })

  if (signUpResult.error) {
    return {
      success: false,
      error: `注册失败: ${signUpResult.error.message}`,
    }
  }

  if (!signUpResult.data.user) {
    return {
      success: false,
      error: '注册失败',
    }
  }

  await createUserWithLearningData(signUpResult.data.user.id, signUpResult.data.user.email, pin)

  return {
    success: true,
    userId: signUpResult.data.user.id,
  }
}

async function ensureUserExists(userId: string, email: string | null, pin: string): Promise<void> {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: userId,
        email,
        pin,
      },
    })
  }
}

async function createUserWithLearningData(userId: string, email: string | null, pin: string): Promise<void> {
  await prisma.user.create({
    data: {
      id: userId,
      email,
      pin,
    },
  })

  await prisma.learningData.create({
    data: {
      userId,
      pinyinPractice: {},
      dictationPractice: {},
      soundGame: {},
      mistakesDictation: {},
      mistakesSound: {},
      statistics: createInitialStatistics(),
    },
  })
}

function createInitialStatistics() {
  return {
    totalPractice: 0,
    correctCount: 0,
    wrongCount: 0,
    startDate: new Date().toISOString(),
  }
}

interface SyncResult {
  success: boolean
  error?: string
}

export async function syncLearningData(userId: string, pin: string, data: unknown): Promise<SyncResult> {
  const encryptedData = encryptData(data, pin)

  const { error } = await supabase
    .from('learning_data')
    .update({
      pinyin_practice: (encryptedData as any).pinyinPractice || {},
      dictation_practice: (encryptedData as any).dictationPractice || {},
      sound_game: (encryptedData as any).soundGame || {},
      mistakes_dictation: (encryptedData as any).mistakesDictation || {},
      mistakes_sound: (encryptedData as any).mistakesSound || {},
      statistics: (encryptedData as any).statistics || {},
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

interface LearningDataResult extends SyncResult {
  data?: {
    pinyinPractice: unknown
    dictationPractice: unknown
    soundGame: unknown
    mistakesDictation: unknown
    mistakesSound: unknown
    statistics: unknown
  }
}

export async function getLearningData(userId: string, pin: string): Promise<LearningDataResult> {
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
    statistics: decryptData(data.statistics as string, pin) || createInitialStatistics(),
  }

  return { success: true, data: decryptedData }
}

export async function saveMistake(
  userId: string,
  type: 'dictation' | 'sound',
  character: string,
  pinyin: string
): Promise<SyncResult> {
  const mistakesField = type === 'dictation' ? 'mistakes_dictation' : 'mistakes_sound'

  const { data, error } = await supabase
    .from('learning_data')
    .select(mistakesField)
    .eq('user_id', userId)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  const mistakes = data[mistakesField] || {}
  const existingMistake = mistakes[character]

  mistakes[character] = {
    count: (existingMistake?.count || 0) + 1,
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
}

interface StatisticsResult extends SyncResult {
  data?: {
    totalPractice: number
    correctCount: number
    wrongCount: number
    startDate: string
  }
}

export async function updateStatistics(userId: string, correct: boolean): Promise<StatisticsResult> {
  const { data, error } = await supabase
    .from('learning_data')
    .select('statistics')
    .eq('user_id', userId)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  const stats = data.statistics || createInitialStatistics()
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
}
