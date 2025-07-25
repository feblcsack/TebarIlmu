// AI Learning Assistant Component
'use client'
import { useState, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Badge } from '../../components/ui/badge'
import { Bot, User, Send, BookOpen, Lightbulb, Languages } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  category?: 'explanation' | 'resource' | 'quiz' | 'translation'
}

interface AILearningAssistantProps {
  sessionTopic: string
  currentMaterial?: string
  userLevel: 'beginner' | 'intermediate' | 'advanced'
}

export function AILearningAssistant({ 
  sessionTopic, 
  currentMaterial, 
  userLevel 
}: AILearningAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null)

  useEffect(() => {
    // Initialize Gemini AI
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey) {
      setGenAI(new GoogleGenerativeAI(apiKey))
    }

    // Welcome message
    setMessages([{
      id: '1',
      type: 'ai',
      content: `Halo! Saya AI Assistant untuk sesi "${sessionTopic}". Saya siap membantu Anda memahami materi, memberikan penjelasan tambahan, atau menjawab pertanyaan. Bagaimana saya bisa membantu?`,
      timestamp: new Date(),
      category: 'explanation'
    }])
  }, [sessionTopic])

  const sendMessage = async () => {
    if (!input.trim() || !genAI) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      // Create context-aware prompt
      const contextPrompt = `
        Anda adalah AI Learning Assistant untuk platform pembelajaran gratis.
        
        Konteks Sesi:
        - Topik: ${sessionTopic}
        - Level Siswa: ${userLevel}
        ${currentMaterial ? `- Materi Saat Ini: ${currentMaterial}` : ''}
        
        Instruksi:
        1. Berikan jawaban yang sesuai dengan level siswa (${userLevel})
        2. Fokus pada topik "${sessionTopic}"
        3. Gunakan bahasa Indonesia yang mudah dipahami
        4. Berikan contoh praktis jika memungkinkan
        5. Jika diminta translate, berikan terjemahan yang akurat
        6. Jika diminta quiz, buat pertanyaan yang relevan dengan materi
        
        Pertanyaan Siswa: ${input}
      `

      const result = await model.generateContent(contextPrompt)
      const response = await result.response
      const text = response.text()

      // Categorize response
      let category: Message['category'] = 'explanation'
      if (input.toLowerCase().includes('quiz') || input.toLowerCase().includes('soal')) {
        category = 'quiz'
      } else if (input.toLowerCase().includes('translate') || input.toLowerCase().includes('terjemah')) {
        category = 'translation'
      } else if (input.toLowerCase().includes('resource') || input.toLowerCase().includes('belajar lebih')) {
        category = 'resource'
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: text,
        timestamp: new Date(),
        category
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { label: 'Jelaskan konsep dasar', icon: BookOpen, prompt: 'Jelaskan konsep dasar dari materi ini dengan bahasa yang mudah dipahami' },
    { label: 'Buat quiz', icon: Lightbulb, prompt: 'Buatkan 3 soal quiz untuk menguji pemahaman materi ini' },
    { label: 'Translate ke English', icon: Languages, prompt: 'Translate penjelasan terakhir ke bahasa Inggris' },
    { label: 'Berikan contoh praktis', icon: BookOpen, prompt: 'Berikan contoh praktis dari konsep yang sedang dipelajari' }
  ]

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          AI Learning Assistant
          <Badge variant="secondary" className="ml-auto">
            {sessionTopic}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.category && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8 justify-start"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya apa saja tentang materi..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}