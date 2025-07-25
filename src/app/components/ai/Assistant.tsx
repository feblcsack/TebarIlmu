'use client'
import { useState, useEffect, useRef } from 'react'
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)


  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (hasUserInteracted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, hasUserInteracted])
  

  useEffect(() => {
    // Initialize Gemini AI
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey) {
      setGenAI(new GoogleGenerativeAI(apiKey))
    }

    setMessages([{
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI Assistant for the session "${sessionTopic}". I'm here to help you understand the material, give additional explanations, or answer your questions. How can I assist you today?`,
      timestamp: new Date(),
      category: 'explanation'
    }])
    
  }, [sessionTopic])

  const sendMessage = async () => {
    if (!input.trim() || !genAI) return
    setHasUserInteracted(true)

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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      
      const contextPrompt = `
  You are an AI Learning Assistant for a free educational platform.

  Session Context:
  - Topic: ${sessionTopic}
  - Student Level: ${userLevel}
  ${currentMaterial ? `- Current Material: ${currentMaterial}` : ''}

  Instructions:
  1. Respond at the appropriate level (${userLevel}) for the student.
  2. Focus on the topic: "${sessionTopic}".
  3. Use clear and simple English.
  4. Provide practical examples when possible.
  5. If the student asks to translate, provide accurate translation.
  6. If asked for a quiz, generate relevant questions based on the topic.

  Student's Question: ${input}
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
    { label: 'Explain the basics', icon: BookOpen, prompt: 'Explain the basic concept of this material in a simple way' },
    { label: 'Create a quiz', icon: Lightbulb, prompt: 'Create 3 quiz questions to test understanding of this topic' },
    { label: 'Translate to Bahasa Indonesia', icon: Languages, prompt: 'Translate the last explanation to Indonesian' },
    { label: 'Give a practical example', icon: BookOpen, prompt: 'Give a practical example of the concept being studied' }
  ]
  

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          AI Learning Assistant
          <Badge variant="secondary" className="ml-auto">
            {sessionTopic}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Messages Container - Fixed height and overflow */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea ref={scrollAreaRef} className="h-full w-full">
            <div className="space-y-3 p-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`rounded-lg p-3 break-words overflow-wrap-anywhere ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
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
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-shrink-0 w-full">
  {quickActions.map((action, index) => (
    <Button
      key={index}
      variant="outline"
      size="sm"
      className="text-xs h-8 justify-start whitespace-normal break-words w-full"
      onClick={() => handleQuickAction(action.prompt)}
      disabled={isLoading}
    >
      <action.icon className="h-3 w-3 mr-1 flex-shrink-0" />
      <span className="truncate">{action.label}</span>
    </Button>
  ))}
</div>


        <div className="flex gap-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything"
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