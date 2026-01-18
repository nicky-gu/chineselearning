'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Volume2, Home, RotateCcw } from 'lucide-react'
import { getRandomHanzi } from '@/data/hanzi-data'
import { toast } from '@/hooks/use-toast'

interface HanziItem {
  char: string
  pinyin: string
  stroke: number
  radical: string
}

interface GameOption {
  char: string
  pinyin: string
  isCorrect: boolean
}

export default function SoundGamePage() {
  const router = useRouter()
  const [hanziList, setHanziList] = useState<HanziItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<GameOption[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

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

    startNewGame()
  }, [router])

  function startNewGame() {
    const newHanziList = getRandomHanzi(10)
    setHanziList(newHanziList)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    generateOptions(newHanziList[0], newHanziList)
  }

  function generateOptions(currentHanzi: HanziItem, allHanzi: HanziItem[]) {
    const correctOption: GameOption = {
      char: currentHanzi.char,
      pinyin: currentHanzi.pinyin,
      isCorrect: true,
    }

    // 随机选择3个错误选项
    const wrongOptions = allHanzi
      .filter(h => h.char !== currentHanzi.char)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(h => ({
        char: h.char,
        pinyin: h.pinyin,
        isCorrect: false,
      }))

    // 打乱选项顺序
    const shuffledOptions = [correctOption, ...wrongOptions]
      .sort(() => Math.random() - 0.5)

    setOptions(shuffledOptions)
  }

  function speakPinyin(pinyin: string) {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(pinyin)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.7
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      toast({
        title: '不支持语音',
        description: '您的浏览器不支持语音合成',
        variant: 'destructive',
      })
    }
  }

  function selectOption(selectedPinyin: string) {
    if (showResult) return

    const correctPinyin = hanziList[currentIndex].pinyin.toLowerCase()
    const isCorrect = correctPinyin === selectedPinyin.toLowerCase()

    setShowResult(true)

    if (isCorrect) {
      setScore(score + 1)
      toast({
        title: '正确！',
        description: `太棒了！`,
      })
    } else {
      toast({
        title: '错误',
        description: `正确答案是 ${correctPinyin}`,
        variant: 'destructive',
      })
    }
  }

  function nextQuestion() {
    if (currentIndex < hanziList.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setShowResult(false)
      generateOptions(hanziList[nextIndex], hanziList)
    } else {
      toast({
        title: '游戏结束！',
        description: `您的得分是：${score}/${hanziList.length}`,
      })
    }
  }

  const currentHanzi = hanziList[currentIndex]
  const progress = ((currentIndex + 1) / hanziList.length) * 100

  if (!currentHanzi) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div className="text-sm text-gray-600">
            得分: {score}/{hanziList.length}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>进度</span>
            <span>{currentIndex + 1}/{hanziList.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>声音游戏</CardTitle>
            <CardDescription>
              听发音，选择正确的拼音
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <Button
                size="lg"
                onClick={() => speakPinyin(currentHanzi.pinyin)}
                disabled={isSpeaking}
                className="w-48 h-20 text-lg"
              >
                <Volume2 className="w-6 h-6 mr-2" />
                {isSpeaking ? '播放中...' : '播放发音'}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                点击按钮听发音，然后选择正确的拼音
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => {
                const isSelected = showResult
                const isCorrectOption = option.isCorrect
                const showCorrect = isSelected && isCorrectOption
                const showWrong = isSelected && !isCorrectOption

                return (
                  <Button
                    key={index}
                    variant={showCorrect ? 'default' : showWrong ? 'destructive' : 'outline'}
                    size="lg"
                    onClick={() => selectOption(option.pinyin)}
                    disabled={showResult}
                    className="h-20 text-xl"
                  >
                    {option.pinyin}
                  </Button>
                )
              })}
            </div>

            {showResult && (
              <Button
                className="w-full"
                onClick={nextQuestion}
              >
                {currentIndex < hanziList.length - 1 ? '下一题' : '完成游戏'}
              </Button>
            )}
          </CardContent>
        </Card>

        {currentIndex === hanziList.length - 1 && showResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>游戏结束！</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-purple-600">
                  {score}/{hanziList.length}
                </div>
                <div className="text-lg">
                  正确率: {((score / hanziList.length) * 100).toFixed(1)}%
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startNewGame}>
                    再玩一次
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                  >
                    返回首页
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
