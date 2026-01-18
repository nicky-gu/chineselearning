/**
 * 性能优化工具
 * 提供 React 性能优化辅助函数和自定义 Hooks
 */

import { useMemo, useCallback, useRef, useEffect } from 'react'

// ========== 性能监控 ==========

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

const performanceMetrics: PerformanceMetric[] = []

export function measurePerformance(name: string, fn: () => void): void {
  const start = performance.now()

  fn()

  const end = performance.now()
  const duration = end - start

  performanceMetrics.push({
    name,
    duration,
    timestamp: Date.now(),
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
  }
}

export function getPerformanceMetrics(): PerformanceMetric[] {
  return [...performanceMetrics]
}

export function clearPerformanceMetrics(): void {
  performanceMetrics.length = 0
}

// ========== 记忆化辅助函数 ==========

/**
 * 创建稳定的记忆化回调
 * 用于优化传递给子组件的回调函数
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps)
}

/**
 * 记忆化计算结果
 * 用于优化昂贵的计算
 */
export function useMemoized<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps)
}

// ========== 防抖和节流 ==========

/**
 * 防抖 Hook - 延迟执行函数
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(function cleanup() {
    return function clearTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return function debouncedCallback(...args: Parameters<T>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

/**
 * 节流 Hook - 限制函数执行频率
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(function cleanup() {
    return function clearTimeout() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return function throttledCallback(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastRun = now - lastRunRef.current

    if (timeSinceLastRun >= delay) {
      callback(...args)
      lastRunRef.current = now
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
        lastRunRef.current = Date.now()
      }, delay - timeSinceLastRun)
    }
  }
}

// ========== 懒加载辅助 ==========

/**
 * 懒加载组件
 */
export function useLazyImport<T>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode
): { Component: T | null; loading: boolean } {
  const [Component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(function loadComponent() {
    importFn()
      .then((module) => {
        setComponent(module.default)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load component:', error)
        setLoading(false)
      })
  }, [importFn])

  return { Component, loading }
}

// ========== 性能优化 Hook ==========

/**
 * 监控组件渲染性能
 */
export function useRenderPerformance(componentName: string) {
  const renderCountRef = useRef(0)
  const lastRenderTimeRef = useRef<number>(performance.now())

  useEffect(function trackRender() {
    renderCountRef.current += 1
    const now = performance.now()
    const renderTime = now - lastRenderTimeRef.current

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Render Performance] ${componentName}: ` +
        `render #${renderCountRef.current}, ` +
        `time since last: ${renderTime.toFixed(2)}ms`
      )
    }

    lastRenderTimeRef.current = now
  })
}

/**
 * 避免不必要的重新渲染
 */
export function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>(value)
  const lastValue = ref.current

  if (!deepEquals(value, lastValue)) {
    ref.current = value
  }

  return ref.current
}

function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a as object)
    const keysB = Object.keys(b as object)

    if (keysA.length !== keysB.length) {
      return false
    }

    return keysA.every((key) => {
      const valueA = (a as Record<string, unknown>)[key]
      const valueB = (b as Record<string, unknown>)[key]
      return deepEquals(valueA, valueB)
    })
  }

  return false
}

// ========== 资源加载优化 ==========

/**
 * 预加载资源
 */
export function preloadResource(url: string): void {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = 'fetch'
  document.head.appendChild(link)
}

/**
 * 预连接到源
 */
export function preconnectToOrigin(origin: string): void {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = origin
  document.head.appendChild(link)
}

// ========== 内存优化 ==========

/**
 * 清理大对象引用
 */
export function useCleanupEffect(
  cleanup: () => void,
  deps: React.DependencyList
): void {
  useEffect(function cleanupOnUnmount() {
    return function cleanup() {
      cleanup()
    }
  }, deps)
}

/**
 * 使用弱引用避免内存泄漏
 */
export function useWeakRef<T extends object>(initialValue: T): WeakRef<T> {
  const ref = useRef<WeakRef<T>>(new WeakRef(initialValue))

  useEffect(function setupWeakRef() {
    ref.current = new WeakRef(initialValue)

    return function cleanup() {
      ref.current = new WeakRef({} as T)
    }
  }, [initialValue])

  return ref.current
}
