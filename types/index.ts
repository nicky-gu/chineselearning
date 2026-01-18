/**
 * 全局类型定义
 * 定义整个应用中使用的共享类型
 */

// ========== 用户相关类型 ==========

export interface User {
  id: string
  email: string | null
  pin: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  learningData?: LearningData
  aiInteractions?: AIInteraction[]
  aiUsageQuotas?: AiUsageQuota[]
}

// ========== 学习数据类型 ==========

export interface LearningData {
  id: string
  userId: string
  pinyinPractice: PinyinPracticeData
  dictationPractice: DictationPracticeData
  soundGame: SoundGameData
  mistakesDictation: Record<string, MistakeEntry>
  mistakesSound: Record<string, MistakeEntry>
  statistics: LearningStatistics
  createdAt: Date
  updatedAt: Date
}

export interface PinyinPracticeData {
  [key: string]: {
    attempts: number
    correct: number
    lastAttempt: string
  }
}

export interface DictationPracticeData {
  [key: string]: {
    attempts: number
    correct: number
    lastAttempt: string
  }
}

export interface SoundGameData {
  [key: string]: {
    attempts: number
    correct: number
    lastAttempt: string
  }
}

export interface MistakeEntry {
  count: number
  pinyin: string
  lastWrong: string
}

export interface LearningStatistics {
  totalPractice: number
  correctCount: number
  wrongCount: number
  accuracy: number
  startDate: string
  lastPracticeDate?: string
  streakDays?: number
}

// ========== AI相关类型 ==========

export interface AIInteraction {
  id: string
  userId: string
  interactionType: AIInteractionType
  inputData: unknown
  aiResponse: unknown
  modelUsed: AIModel
  tokensUsed: number
  createdAt: Date
}

export type AIInteractionType =
  | 'pinyin_correction'
  | 'word_generation'
  | 'sentence_generation'
  | 'chat'
  | 'progress_analysis'

export type AIModel =
  | 'Qwen/Qwen3-8B'
  | 'Qwen/Qwen2.5-7B-Instruct'
  | 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'
  | 'THUDM/glm-4-9b-chat'
  | 'deepseek-ai/DeepSeek-OCR'
  | 'FunAudioLLM/SenseVoiceSmall'

export interface AiUsageQuota {
  id: string
  userId: string
  date: Date
  requestCount: number
  createdAt: Date
  updatedAt: Date
}

// ========== 认证相关类型 ==========

export interface AuthResult {
  success: boolean
  error?: string
  userId?: string
}

export interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  isLoading: boolean
}

// ========== 组件Props类型 ==========

export interface BaseButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export interface PracticeCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

// ========== API响应类型 ==========

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ========== 练习相关类型 ==========

export interface HanziItem {
  char: string
  pinyin: string
  stroke: number
  radical: string
}

export interface PracticeResult {
  correct: boolean
  userAnswer: string
  correctAnswer: string
  timestamp: string
}

export interface PracticeSession {
  id: string
  type: 'pinyin' | 'dictation' | 'sound'
  startTime: string
  endTime?: string
  results: PracticeResult[]
  score: number
  totalQuestions: number
}

// ========== 表单类型 ==========

export interface LoginForm {
  pin: string
}

export interface PracticeForm {
  answer: string
  currentHanzi: HanziItem
}

// ========== UI状态类型 ==========

export interface ToastState {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export interface ModalState {
  isOpen: boolean
  title: string
  content: React.ReactNode
}

// ========== 错误类型 ==========

export interface AppError {
  code: string
  message: string
  details?: unknown
}

export class ApplicationError extends Error {
  code: string
  details?: unknown

  constructor(code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApplicationError'
    this.code = code
    this.details = details
  }
}

// ========== 工具类型 ==========

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ========== 环境变量类型 ==========

export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  DATABASE_URL: string
  SILICONFLOW_API_KEY: string
  ENCRYPTION_KEY: string
  NEXT_PUBLIC_APP_URL: string
}

// ========== 性能监控类型 ==========

export interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  timestamp: number
}

export interface PageLoadMetrics {
  domContentLoaded: number
  loadComplete: number
  firstPaint: number
  firstContentfulPaint: number
}

// ========== 统计分析类型 ==========

export interface DailyStats {
  date: string
  practiceCount: number
  accuracy: number
  timeSpent: number
}

export interface WeeklyStats {
  weekStart: string
  weekEnd: string
  totalPractice: number
  averageAccuracy: number
  bestDay: string
  worstDay: string
}

export interface ProgressAnalysis {
  overallProgress: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}
