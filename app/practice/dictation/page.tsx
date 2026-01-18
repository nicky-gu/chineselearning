'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Volume2, Check, X, ArrowRight, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getRandomHanzi } from '@/data/hanzi-data'
import { toast } from '@/hooks/use-toast'

const PRACTICE_COUNT = 10
const SPEECH_RATE = 0.7
const USER_ID_KEY = 'user_id'

interface HanziItem {
  char: string
  pinyin: string
  stroke: number
  radical: string
}

export default function DictationPracticePage() {
  const router = useRouter()
  const [hanziList, setHanziList] = useState<HanziItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userHanzi, setUserHanzi] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(function checkAuthentication() {
    const userId = localStorage.getItem(USER_ID_KEY)

    if (!userId) {
      toast({
        title: '未登录',
        description: '请先登录',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    startNewPractice()
  }, [router])

  function startNewPractice() {
    const newHanziList = getRandomHanzi(PRACTICE_COUNT)
    setHanziList(newHanziList)
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)
    setUserHanzi('')
  }

  function speakHanzi(hanzi: string) {
    if (!supportsSpeechSynthesis()) {
      toast({
        title: '不支持语音',
        description: '您的浏览器不支持语音合成',
        variant: 'destructive',
      })
      return
    }

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(hanzi)
    utterance.lang = 'zh-CN'
    utterance.rate = SPEECH_RATE
    utterance.onend = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  function supportsSpeechSynthesis(): boolean {
    return 'speechSynthesis' in window
  }

  function checkAnswer() {
    const currentHanzi = hanziList[currentIndex]
    const correctHanzi = currentHanzi.char
    const userAnswer = userHanzi.trim()
    const correct = correctHanzi === userAnswer

    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 1)
      toast({
        title: '正确！',
        description: `太棒了！正确答案是 ${correctHanzi}`,
      })
      return
    }

    toast({
      title: '错误',
      description: `正确答案是 ${correctHanzi}，您写的是 ${userAnswer || '空'}`,
      variant: 'destructive',
    })

    const userId = localStorage.getItem(USER_ID_KEY)
    if (userId) {
      saveMistake(userId, currentHanzi)
    }
  }

  async function saveMistake(userId: string, hanzi: HanziItem) {
    try {
      const { saveMistake } = await import('@/app/auth/actions')
      await saveMistake(userId, 'dictation', hanzi.char, hanzi.pinyin)
    } catch (error) {
      console.error('Failed to save mistake:', error)
    }
  }

  function nextQuestion() {
    const nextIndex = currentIndex + 1

    if (nextIndex < hanziList.length) {
      setCurrentIndex(nextIndex)
      setShowResult(false)
      setUserHanzi('')
    } else {
      toast({
        title: '练习完成！',
        description: `您的得分是：${score}/${hanziList.length}`,
      })
    }
  }

  function handleHanziChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserHanzi(event.target.value)
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !showResult && userHanzi.trim()) {
      checkAnswer()
    }
  }

  const currentHanzi = hanziList[currentIndex]
  const progress = hanziList.length > 0 ? ((currentIndex + 1) / hanziList.length) * 100 : 0

  if (!currentHanzi) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-4">
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
            <CardTitle>听写练习</CardTitle>
            <CardDescription>听发音，写出对应的汉字</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <Button
                size="lg"
                onClick={() => speakHanzi(currentHanzi.char)}
                disabled={isSpeaking}
                className="w-48 h-20 text-lg"
              >
                <Volume2 className="w-6 h-6 mr-2" />
                {isSpeaking ? '播放中...' : '播放发音'}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                点击按钮听发音，然后输入对应的汉字
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">请输入汉字:</label>
                <input
                  type="text"
                  value={userHanzi}
                  onChange={handleHanziChange}
                  onKeyPress={handleKeyPress}
                  disabled={showResult}
                  className="w-full px-4 py-3 text-4xl text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="在此输入汉字"
                  maxLength={1}
                  autoFocus
                />
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center justify-center mb-2">
                    {isCorrect ? <Check className="w-8 h-8 text-green-600" /> : <X className="w-8 h-8 text-red-600" />}
                  </div>
                  <div className="text-center text-lg font-medium">
                    {isCorrect ? '正确！' : '错误'}
                  </div>
                  {!isCorrect && (
                    <div className="text-center mt-2 space-y-1">
                      <div className="text-sm">正确答案: <span className="text-2xl font-bold">{currentHanzi.char}</span></div>
                      <div className="text-sm text-gray-600">拼音: {currentHanzi.pinyin}</div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {!showResult ? (
                  <Button className="flex-1" onClick={checkAnswer} disabled={!userHanzi.trim()}>
                    检查答案
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={nextQuestion}>
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
                <Button variant="outline" onClick={startNewPractice}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新开始
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentIndex === hanziList.length - 1 && showResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>练习完成！</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-green-600">{score}/{hanziList.length}</div>
                <div className="text-lg">正确率: {((score / hanziList.length) * 100).toFixed(1)}%</div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={startNewPractice}>再练一次</Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>
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
