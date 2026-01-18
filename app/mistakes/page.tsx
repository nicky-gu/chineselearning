'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Home, Trash2, BookOpen } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Mistake {
  char: string
  pinyin: string
  count: number
  lastWrong: string
  type: 'dictation' | 'sound'
}

export default function MistakesPage() {
  const router = useRouter()
  const [dictationMistakes, setDictationMistakes] = useState<Mistake[]>([])
  const [soundMistakes, setSoundMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
      toast({
        title: '未登录',
        description: '请先登录',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    loadMistakes(userId)
  }, [router])

  async function loadMistakes(userId: string) {
    setLoading(true)
    try {
      // TODO: 从服务器加载错题数据
      // const pin = localStorage.getItem('user_pin')
      // const result = await getLearningData(userId, pin)
      // 暂时使用模拟数据
      setDictationMistakes([])
      setSoundMistakes([])
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载错题数据',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function clearMistake(char: string, type: 'dictation' | 'sound') {
    if (type === 'dictation') {
      setDictationMistakes(prev => prev.filter(m => m.char !== char))
    } else {
      setSoundMistakes(prev => prev.filter(m => m.char !== char))
    }

    toast({
      title: '已删除',
      description: `已删除 ${char} 的错题记录`,
    })

    // TODO: 同步到服务器
  }

  function clearAllMistakes(type: 'dictation' | 'sound' | 'all') {
    if (type === 'dictation') {
      setDictationMistakes([])
    } else if (type === 'sound') {
      setSoundMistakes([])
    } else {
      setDictationMistakes([])
      setSoundMistakes([])
    }

    toast({
      title: '已清空',
      description: '错题记录已清空',
    })

    // TODO: 同步到服务器
  }

  const MistakeList = ({ mistakes, type, title }: { mistakes: Mistake[], type: 'dictation' | 'sound', title: string }) => (
    <div className="space-y-4">
      {mistakes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无{title}错题</p>
            <p className="text-sm mt-2">继续加油！</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">共 {mistakes.length} 个错题</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAllMistakes(type)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空全部
            </Button>
          </div>
          {mistakes.map((mistake) => (
            <Card key={mistake.char}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl font-bold text-gray-900">
                      {mistake.char}
                    </div>
                    <div>
                      <p className="text-lg font-medium">{mistake.pinyin}</p>
                      <p className="text-sm text-gray-600">
                        错误次数: {mistake.count}
                      </p>
                      <p className="text-xs text-gray-500">
                        最后错误时间: {new Date(mistake.lastWrong).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearMistake(mistake.char, type)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>加载中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h1 className="text-3xl font-bold">错题本</h1>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="dictation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dictation">听写错题</TabsTrigger>
            <TabsTrigger value="sound">声音游戏错题</TabsTrigger>
          </TabsList>

          <TabsContent value="dictation">
            <Card>
              <CardHeader>
                <CardTitle>听写练习错题</CardTitle>
                <CardDescription>
                  这些是您在听写练习中答错的题目，建议重点复习
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MistakeList mistakes={dictationMistakes} type="dictation" title="听写" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sound">
            <Card>
              <CardHeader>
                <CardTitle>声音游戏错题</CardTitle>
                <CardDescription>
                  这些是您在声音游戏中答错的题目，建议重点复习
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MistakeList mistakes={soundMistakes} type="sound" title="声音游戏" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {dictationMistakes.length === 0 && soundMistakes.length === 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">太棒了！</h3>
              <p className="text-gray-600">您目前没有错题记录</p>
              <p className="text-sm text-gray-500 mt-2">继续努力，保持这个好习惯！</p>
              <Button
                className="mt-6"
                onClick={() => router.push('/dashboard')}
              >
                开始练习
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
