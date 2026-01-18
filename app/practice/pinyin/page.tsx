'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Volume2, Mic, Check, X, ArrowRight, Home, RotateCcw } from 'lucide-react'
import { getRandomHanzi, HANZI_DATA } from '@/data/hanzi-data'
import { toast } from '@/hooks/use-toast'

interface HanziItem {
  char: string
  pinyin: string
  stroke: number
  radical: string
}

export default function PinyinPracticePage() {
  const router = useRouter()
  const [hanziList, setHanziList] = useState<HanziItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userPinyin, setUserPinyin] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    // 检查登录状态
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

    // 初始化练习题
    startNewPractice()
  }, [router])

  function startNewPractice() {
    const newHanziList = getRandomHanzi(10)
    setHanziList(newHanziList)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    setUserPinyin('')
  }

  function speakPinyin(pinyin: string) {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(pinyin)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
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

  function checkAnswer() {
    const correctPinyin = hanziList[currentIndex].pinyin.toLowerCase()
    const userAnswer = userPinyin.toLowerCase().trim()

    const correct = correctPinyin === userAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
      toast({
        title: '正确！',
        description: `太棒了！${hanziList[currentIndex].char} 的拼音是 ${correctPinyin}`,
      })
    } else {
      toast({
        title: '错误',
        description: `${hanziList[currentIndex].char} 的拼音是 ${correctPinyin}，您输入的是 ${userAnswer}`,
        variant: 'destructive',
      })
    }

    // TODO: 保存结果到服务器
  }

  function nextQuestion() {
    if (currentIndex < hanziList.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowResult(false)
      setUserPinyin('')
    } else {
      // 练习完成
      toast({
        title: '练习完成！',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div className="text-sm text-gray-600">
            得分: {score}/{hanziList.length}
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>进度</span>
            <span>{currentIndex + 1}/{hanziList.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* 主卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>拼音练习</CardTitle>
            <CardDescription>
              听发音，输入正确的拼音
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 汉字显示 */}
            <div className="text-center">
              <div className="text-9xl font-bold text-gray-900 mb-4">
                {currentHanzi.char}
              </div>
              <div className="text-sm text-gray-600">
                笔画: {currentHanzi.stroke} | 部首: {currentHanzi.radical}
              </div>
            </div>

            {/* 播放按钮 */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => speakPinyin(currentHanzi.pinyin)}
                disabled={isSpeaking}
                className="w-40"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isSpeaking ? '播放中...' : '播放发音'}
              </Button>
            </div>

            {/* 答案区域 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  请输入拼音:
                </label>
                <input
                  type="text"
                  value={userPinyin}
                  onChange={(e) => setUserPinyin(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showResult) {
                      checkAnswer()
                    }
                  }}
                  disabled={showResult}
                  className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="例如: hao"
                  autoFocus
                />
              </div>

              {/* 结果显示 */}
              {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center justify-center mb-2">
                    {isCorrect ? (
                      <Check className="w-8 h-8 text-green-600" />
                    ) : (
                      <X className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <div className="text-center text-lg font-medium">
                    {isCorrect ? '正确！' : '错误'}
                  </div>
                  <div className="text-center text-sm mt-2">
                    正确答案: <span className="font-bold">{currentHanzi.pinyin}</span>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3">
                {!showResult ? (
                  <Button
                    className="flex-1"
                    onClick={checkAnswer}
                    disabled={!userPinyin.trim()}
                  >
                    检查答案
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={nextQuestion}
                  >
                    {currentIndex < hanziList.length - 1 ? (
                      <>
                        下一题
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      '完成练习'
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={startNewPractice}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新开始
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 练习完成 */}
        {currentIndex === hanziList.length - 1 && showResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>练习完成！</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-blue-600">
                  {score}/{hanziList.length}
                </div>
                <div className="text-lg">
                  正确率: {((score / hanziList.length) * 100).toFixed(1)}%
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startNewPractice}>
                    再练一次
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
