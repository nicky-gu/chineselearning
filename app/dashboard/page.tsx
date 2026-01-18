'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Mic, Waveform, Brain, BarChart3, LogOut, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalPractice: 0,
    correctCount: 0,
    wrongCount: 0,
    accuracy: 0,
  })

  useEffect(() => {
    // 检查登录状态
    const storedUserId = localStorage.getItem('user_id')
    if (!storedUserId) {
      router.push('/login')
      return
    }
    setUserId(storedUserId)

    // TODO: 从服务器加载统计数据
    loadStatistics(storedUserId)
  }, [router])

  const loadStatistics = async (id: string) => {
    // 这里应该调用API获取统计数据
    // 暂时使用模拟数据
    setStatistics({
      totalPractice: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracy: 0,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_pin')
    toast({
      title: '已退出登录',
      description: '感谢您的使用，再见！',
    })
    router.push('/')
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学习中心</h1>
            <p className="text-gray-600 mt-1">欢迎回来！</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigateTo('/profile')}>
              <User className="w-4 h-4 mr-2" />
              个人中心
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>总练习次数</CardDescription>
              <CardTitle className="text-3xl">{statistics.totalPractice}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>正确次数</CardDescription>
              <CardTitle className="text-3xl text-green-600">{statistics.correctCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>错误次数</CardDescription>
              <CardTitle className="text-3xl text-red-600">{statistics.wrongCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>正确率</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {statistics.accuracy.toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 学习模式选项卡 */}
        <Tabs defaultValue="pinyin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="pinyin" className="gap-2">
              <BookOpen className="w-4 h-4" />
              拼音练习
            </TabsTrigger>
            <TabsTrigger value="dictation" className="gap-2">
              <Mic className="w-4 h-4" />
              听写练习
            </TabsTrigger>
            <TabsTrigger value="sound" className="gap-2">
              <Waveform className="w-4 h-4" />
              声音游戏
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              错题本
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="w-4 h-4" />
              AI助手
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pinyin">
            <Card>
              <CardHeader>
                <CardTitle>拼音练习模式</CardTitle>
                <CardDescription>
                  学习汉字的正确发音，系统会使用AI技术实时纠正您的发音
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    在这个模式下，您将：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>看到汉字并听到标准发音</li>
                    <li>跟读并得到AI发音评估</li>
                    <li>学习声调和拼音规则</li>
                    <li>积累常用汉字词汇</li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => navigateTo('/practice/pinyin')}
                  >
                    开始拼音练习
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dictation">
            <Card>
              <CardHeader>
                <CardTitle>听写练习模式</CardTitle>
                <CardDescription>
                  听音频写出对应的汉字，提高听力理解能力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    在这个模式下，您将：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>听到汉字的发音</li>
                    <li>输入对应的汉字</li>
                    <li>系统会检查答案并记录错题</li>
                    <li>逐步提高听力水平</li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => navigateTo('/practice/dictation')}
                  >
                    开始听写练习
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sound">
            <Card>
              <CardHeader>
                <CardTitle>声音游戏模式</CardTitle>
                <CardDescription>
                  通过趣味游戏，增强对汉字声调和音色的辨识能力
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    在这个模式下，您将：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>玩声调配对游戏</li>
                    <li>辨识不同声调的汉字</li>
                    <li>提高对音调的敏感度</li>
                    <li>在轻松愉快的氛围中学习</li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => navigateTo('/practice/sound')}
                  >
                    开始声音游戏
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mistakes">
            <Card>
              <CardHeader>
                <CardTitle>错题本</CardTitle>
                <CardDescription>
                  查看和练习您之前答错的题目，巩固学习成果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    系统会自动记录您的错题，您可以：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>查看历史错题记录</li>
                    <li>针对薄弱环节进行练习</li>
                    <li>清除已掌握的错题</li>
                    <li>导出错题进行离线复习</li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => navigateTo('/mistakes')}
                  >
                    查看错题本
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI学习助手</CardTitle>
                <CardDescription>
                  智能AI助手为您提供个性化的学习建议和答疑
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI助手可以帮您：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>纠正拼音和发音错误</li>
                    <li>智能组词和造句</li>
                    <li>解答学习疑问</li>
                    <li>提供个性化学习建议</li>
                    <li>分析学习进度</li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => navigateTo('/ai-assistant')}
                  >
                    打开AI助手
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
