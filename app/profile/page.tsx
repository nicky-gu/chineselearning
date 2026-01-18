'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, User, Calendar, Award, Target } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalPractice: 0,
    correctCount: 0,
    wrongCount: 0,
    accuracy: 0,
    startDate: '',
  })

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id')
    if (!storedUserId) {
      toast({
        title: '未登录',
        description: '请先登录',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    setUserId(storedUserId)
    loadStatistics(storedUserId)
  }, [router])

  async function loadStatistics(id: string) {
    // TODO: 从服务器加载统计数据
    // const pin = localStorage.getItem('user_pin')
    // const result = await getLearningData(id, pin)
    // 暂时使用模拟数据
    setStatistics({
      totalPractice: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0,
      startDate: new Date().toISOString(),
    })
  }

  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h1 className="text-3xl font-bold">个人中心</h1>
          <div className="w-20" />
        </div>

        <div className="grid gap-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                用户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">用户ID:</span>
                  <span className="font-mono">{userId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">注册日期:</span>
                  <span>{new Date(statistics.startDate).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 学习统计卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                学习统计
              </CardTitle>
              <CardDescription>
                您的学习成果一目了然
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {statistics.totalPractice}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">总练习次数</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {statistics.correctCount}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">正确次数</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {statistics.wrongCount}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">错误次数</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {statistics.accuracy.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">正确率</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 学习目标卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                学习目标
              </CardTitle>
              <CardDescription>
                设定并追踪您的学习目标
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>每日练习目标</span>
                    <span className="text-gray-600">20/30 次</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: '66.7%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>正确率目标</span>
                    <span className="text-gray-600">{statistics.accuracy.toFixed(1)}%/80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(statistics.accuracy / 0.8 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>连续学习天数</span>
                    <span className="text-gray-600">1 天</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: '14.3%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 学习成就卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                学习成就
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">初次练习</div>
                  <div className="text-xs text-gray-500 mt-1">已解锁</div>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="text-sm font-medium">连续7天</div>
                  <div className="text-xs text-gray-500 mt-1">1/7 天</div>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="text-2xl mb-2">💯</div>
                  <div className="text-sm font-medium">完美100题</div>
                  <div className="text-xs text-gray-500 mt-1">0/100 题</div>
                </div>
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-sm font-medium">学习达人</div>
                  <div className="text-xs text-gray-500 mt-1">0/1000 次</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
