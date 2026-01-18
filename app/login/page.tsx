'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authenticateWithPin } from '../auth/actions'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 8) {
      toast({
        title: 'PIN码错误',
        description: '请输入8位数字PIN码',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await authenticateWithPin(pin)

      if (result.success) {
        // 保存PIN到localStorage用于数据加密
        localStorage.setItem('user_pin', pin)
        localStorage.setItem('user_id', result.userId || '')

        toast({
          title: '登录成功',
          description: '欢迎回来！',
        })

        router.push('/dashboard')
      } else {
        toast({
          title: '登录失败',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: '系统错误，请稍后重试',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
    setPin(value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">汉字学习</CardTitle>
          <CardDescription>请输入8位PIN码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="请输入8位PIN码"
                value={pin}
                onChange={handlePinChange}
                className="text-center text-2xl tracking-widest h-16"
                maxLength={8}
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                首次使用将自动创建账户
              </p>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={pin.length !== 8 || isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>使用PIN码保护您的学习数据</p>
            <p className="mt-1">所有数据都经过加密存储</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
