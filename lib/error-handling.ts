/**
 * 统一错误处理系统
 * 提供标准化的错误创建、处理和用户通知
 */

import { toast } from '@/hooks/use-toast'

export enum ErrorCode {
  // 认证错误
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_PIN = 'INVALID_PIN',
  AUTH_FAILED = 'AUTH_FAILED',

  // 数据错误
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',

  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',

  // AI服务错误
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',

  // 一般错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorContext {
  code: ErrorCode
  message: string
  details?: unknown
  timestamp: string
}

export class AppError extends Error {
  code: ErrorCode
  details?: unknown
  timestamp: string

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

export function createError(
  code: ErrorCode,
  message: string,
  details?: unknown
): AppError {
  return new AppError(code, message, details)
}

export function handleError(error: unknown): void {
  if (error instanceof AppError) {
    showErrorToast(error)
  } else if (error instanceof Error) {
    showGenericError(error.message)
  } else {
    showGenericError('发生未知错误')
  }
}

function showErrorToast(error: AppError): void {
  const toastConfig = {
    title: getErrorTitle(error.code),
    description: error.message,
    variant: 'destructive' as const,
  }

  toast(toastConfig)
}

function showGenericError(message: string): void {
  toast({
    title: '错误',
    description: message,
    variant: 'destructive',
  })
}

function getErrorTitle(code: ErrorCode): string {
  const titles: Record<ErrorCode, string> = {
    [ErrorCode.UNAUTHORIZED]: '未授权',
    [ErrorCode.INVALID_PIN]: 'PIN码错误',
    [ErrorCode.AUTH_FAILED]: '认证失败',
    [ErrorCode.NOT_FOUND]: '未找到',
    [ErrorCode.VALIDATION_ERROR]: '验证错误',
    [ErrorCode.DECRYPTION_FAILED]: '解密失败',
    [ErrorCode.NETWORK_ERROR]: '网络错误',
    [ErrorCode.SERVER_ERROR]: '服务器错误',
    [ErrorCode.AI_QUOTA_EXCEEDED]: 'AI配额超限',
    [ErrorCode.AI_SERVICE_ERROR]: 'AI服务错误',
    [ErrorCode.UNKNOWN_ERROR]: '未知错误',
  }

  return titles[code] || '错误'
}

export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorContext?: string
): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    if (error instanceof Error) {
      handleError(error)
    }
    return null
  }
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AppError &&
    (error.code === ErrorCode.UNAUTHORIZED ||
     error.code === ErrorCode.INVALID_PIN ||
     error.code === ErrorCode.AUTH_FAILED)
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AppError &&
    (error.code === ErrorCode.NETWORK_ERROR ||
     error.code === ErrorCode.SERVER_ERROR)
}

export function isAIQuotaError(error: unknown): boolean {
  return error instanceof AppError && error.code === ErrorCode.AI_QUOTA_EXCEEDED
}

// 错误边界专用
export function logError(error: unknown, context?: string): void {
  const errorInfo = {
    error,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  // 在开发环境打印详细错误
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo)
  }

  // TODO: 发送到错误追踪服务（如 Sentry）
}

export function createErrorHandler(componentName: string) {
  return function errorHandler(error: unknown, context?: string): void {
    logError(error, `${componentName}: ${context}`)
    handleError(error)
  }
}
