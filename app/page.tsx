'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mic, Waveform, Brain, BarChart3, LogOut } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 检查是否已登录
    const userId = localStorage.getItem('user_id')
    if (userId) {
      router.push('/dashboard')
    }
  }, [router])

  const handleStart = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">汉字学习</h1>
          <p className="text-xl text-gray-600">智能AI驱动的汉字学习平台</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOut className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>拼音练习</CardTitle>
              <CardDescription>
                学习汉字的正确发音，通过语音识别技术实时纠正发音
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mic className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>听写练习</CardTitle>
              <CardDescription>
                听音频写汉字，提高听力理解和汉字书写能力
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Waveform className="w-12 h-12 text-purple-600 mb-2" />
              <CardTitle>声音游戏</CardTitle>
              <CardDescription>
                通过趣味声音游戏，增强对汉字音调的敏感度
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-12 h-12 text-pink-600 mb-2" />
              <CardTitle>AI助手</CardTitle>
              <CardDescription>
                智能学习助手，提供个性化学习建议和答疑解惑
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-orange-600 mb-2" />
              <CardTitle>学习统计</CardTitle>
              <CardDescription>
                详细的学习数据分析，追踪学习进度和成果
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">开始学习</CardTitle>
              <CardDescription className="text-blue-50">
                点击按钮开始您的汉字学习之旅
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-blue-50"
                onClick={handleStart}
              >
                立即开始
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-gray-600">
          <p className="mb-2">✨ 基于硅基流动AI技术提供智能学习体验</p>
          <p className="text-sm">所有数据加密存储 · 保护您的隐私</p>
        </div>
      </div>
    </div>
  )
}
