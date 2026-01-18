'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Home, Send, Bot, Sparkles, Volume2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

    // 添加欢迎消息
    setMessages([
      {
        role: 'assistant',
        content: '您好！我是您的AI学习助手。我可以帮您：\n\n• 纠正拼音和发音错误\n• 智能组词和造句\n• 解答学习疑问\n• 提供个性化学习建议\n• 分析学习进度\n\n请问有什么可以帮助您的吗？',
        timestamp: new Date(),
      },
    ])
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // TODO: 调用硅基流动AI API
      // 这里暂时使用模拟响应
      setTimeout(() => {
        const aiResponse: Message = {
          role: 'assistant',
          content: generateMockResponse(input.trim()),
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      toast({
        title: '发送失败',
        description: '无法连接到AI服务，请稍后重试',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  function generateMockResponse(question: string): string {
    const lowerQ = question.toLowerCase()

    if (lowerQ.includes('拼音') || lowerQ.includes('发音')) {
      return '关于拼音和发音，我建议：\n\n1. 注意声调的准确性\n2. 多听标准发音进行模仿\n3. 使用录音功能对比自己的发音\n4. 重点练习容易混淆的声母和韵母\n\n您想练习哪个字的发音？我可以帮您纠正。'
    }

    if (lowerQ.includes('组词') || lowerQ.includes('造句')) {
      return '智能组词功能正在开发中，即将为您提供服务！\n\n届时您可以：\n• 输入一个字，让AI为您组词\n• 输入一个词，让AI为您造句\n• 学习词语的正确用法'
    }

    if (lowerQ.includes('怎么学') || lowerQ.includes('建议')) {
      return '根据我的分析，建议您：\n\n1. 每天坚持练习15-20分钟\n2. 先掌握拼音，再学习汉字\n3. 多听多说，培养语感\n4. 及时复习错题\n5. 使用AI助手随时提问\n\n学习是一个循序渐进的过程，坚持下去一定会有进步！'
    }

    return '感谢您的提问！作为您的AI学习助手，我会尽力帮助您学习汉字。\n\n您可以问我关于：\n• 拼音和发音的问题\n• 汉字的组词和造句\n• 学习方法和建议\n• 具体汉字的解释\n\n请问还有什么我可以帮助您的吗？'
  }

  async function checkPinyinCorrection(hanzi: string, userPinyin: string) {
    setInput(`请帮我检查"${hanzi}"的拼音"${userPinyin}"是否正确`)
    sendMessage()
  }

  async function generateWords(hanzi: string) {
    setInput(`请为"${hanzi}"组几个词`)
    sendMessage()
  }

  async function generateSentence(word: string) {
    setInput(`请用"${word}"造一个句子`)
    sendMessage()
  }

  function speakText(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    } else {
      toast({
        title: '不支持语音',
        description: '您的浏览器不支持语音合成',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">AI学习助手</h1>
          </div>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">对话</TabsTrigger>
            <TabsTrigger value="pinyin">拼音纠错</TabsTrigger>
            <TabsTrigger value="words">智能组词</TabsTrigger>
            <TabsTrigger value="sentence">造句助手</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  AI对话助手
                </CardTitle>
                <CardDescription>
                  随时向我提问学习相关的问题
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 whitespace-pre-wrap">
                            {message.content}
                          </div>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 h-6 w-6 p-0"
                              onClick={() => speakText(message.content)}
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div
                          className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入您的问题..."
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pinyin">
            <Card>
              <CardHeader>
                <CardTitle>拼音纠错</CardTitle>
                <CardDescription>
                  让AI帮您检查拼音是否正确
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">汉字</label>
                    <Input
                      placeholder="例如: 好"
                      onChange={(e) => {
                        // TODO: 实现拼音纠错功能
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">您认为的拼音</label>
                    <Input
                      placeholder="例如: hao"
                      onChange={(e) => {
                        // TODO: 实现拼音纠错功能
                      }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      // TODO: 实现拼音纠错功能
                      toast({
                        title: '功能开发中',
                        description: '拼音纠错功能即将上线',
                      })
                    }}
                  >
                    检查拼音
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="words">
            <Card>
              <CardHeader>
                <CardTitle>智能组词</CardTitle>
                <CardDescription>
                  输入汉字，AI为您生成词语
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">汉字</label>
                    <Input
                      placeholder="例如: 学"
                      onChange={(e) => {
                        // TODO: 实现智能组词功能
                      }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      // TODO: 实现智能组词功能
                      toast({
                        title: '功能开发中',
                        description: '智能组词功能即将上线',
                      })
                    }}
                  >
                    生成词语
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentence">
            <Card>
              <CardHeader>
                <CardTitle>造句助手</CardTitle>
                <CardDescription>
                  输入词语，AI为您造句
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">词语</label>
                    <Input
                      placeholder="例如: 学习"
                      onChange={(e) => {
                        // TODO: 实现造句功能
                      }}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      // TODO: 实现造句功能
                      toast({
                        title: '功能开发中',
                        description: '造句助手功能即将上线',
                      })
                    }}
                  >
                    生成句子
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
