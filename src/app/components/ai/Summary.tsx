// AI Session Summary Generator
'use client'
import { useState, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Download, 
  Share2,
  Clock,
  Users,
  BookOpen,
  Brain
} from 'lucide-react'

interface SessionData {
  topic: string
  duration: number
  participants: number
  chatLog?: string[]
  materials?: string[]
  mentorNotes?: string
}

interface SessionSummary {
  keyPoints: string[]
  actionItems: string[]
  quiz: Array<{
    question: string
    options: string[]
    correct: number
  }>
  followUpTopics: string[]
  resources: string[]
  nextSteps: string[]
}

interface SessionSummaryGeneratorProps {
  sessionData: SessionData
  onSummaryGenerated?: (summary: SessionSummary) => void
}

export function SessionSummaryGenerator({ 
  sessionData, 
  onSummaryGenerated 
}: SessionSummaryGeneratorProps) {
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey) {
      setGenAI(new GoogleGenerativeAI(apiKey))
    }
  }, [])

  const generateSummary = async () => {
    if (!genAI) return

    setIsGenerating(true)
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const prompt = `
        Anda adalah AI yang bertugas membuat ringkasan sesi pembelajaran.
        
        Data Sesi:
        - Topik: ${sessionData.topic}
        - Durasi: ${sessionData.duration} menit
        - Jumlah Peserta: ${sessionData.participants}
        ${sessionData.chatLog ? `- Chat Log: ${sessionData.chatLog.join('\n')}` : ''}
        ${sessionData.materials ? `- Materi: ${sessionData.materials.join(', ')}` : ''}
        ${sessionData.mentorNotes ? `- Catatan Mentor: ${sessionData.mentorNotes}` : ''}
        
        Buatkan ringkasan sesi dalam format JSON dengan struktur berikut:
        {
          "keyPoints": ["poin penting 1", "poin penting 2", ...],
          "actionItems": ["tugas 1", "tugas 2", ...],
          "quiz": [
            {
              "question": "pertanyaan",
              "options": ["a", "b", "c", "d"],
              "correct": 0
            }
          ],
          "followUpTopics": ["topik lanjutan 1", "topik lanjutan 2", ...],
          "resources": ["resource 1", "resource 2", ...],
          "nextSteps": ["langkah selanjutnya 1", "langkah selanjutnya 2", ...]
        }
        
        Pastikan:
        1. keyPoints berisi 3-5 poin penting dari sesi
        2. actionItems berisi tugas konkret untuk siswa
        3. quiz berisi 3-5 soal pilihan ganda yang relevan
        4. followUpTopics berisi topik yang sebaiknya dipelajari selanjutnya
        5. resources berisi rekomendasi sumber belajar tambahan
        6. nextSteps berisi langkah konkret untuk melanjutkan pembelajaran
        
        Berikan hanya JSON, tanpa penjelasan tambahan.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedSummary = JSON.parse(jsonMatch[0])
          setSummary(parsedSummary)
          onSummaryGenerated?.(parsedSummary)
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        // Fallback: create basic summary
        const fallbackSummary: SessionSummary = {
          keyPoints: [`Sesi "${sessionData.topic}" telah selesai`, 'Materi berhasil disampaikan', 'Peserta aktif mengikuti pembelajaran'],
          actionItems: ['Review materi yang telah dipelajari', 'Praktikkan konsep yang diajarkan'],
          quiz: [{
            question: `Apa topik utama yang dibahas dalam sesi ini?`,
            options: [sessionData.topic, 'Topik lain', 'Tidak ada topik', 'Semua benar'],
            correct: 0
          }],
          followUpTopics: ['Topik lanjutan akan dibahas pada sesi berikutnya'],
          resources: ['Dokumentasi resmi', 'Tutorial online', 'Buku referensi'],
          nextSteps: ['Bergabung dengan sesi berikutnya', 'Hubungi mentor untuk pertanyaan lanjutan']
        }
        setSummary(fallbackSummary)
        onSummaryGenerated?.(fallbackSummary)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadSummary = () => {
    if (!summary) return
    
    const summaryText = `
# Ringkasan Sesi: ${sessionData.topic}

## 📋 Informasi Sesi
- **Durasi**: ${sessionData.duration} menit
- **Peserta**: ${sessionData.participants} orang
- **Tanggal**: ${new Date().toLocaleDateString('id-ID')}

## 🎯 Poin Penting
${summary.keyPoints.map(point => `• ${point}`).join('\n')}

## ✅ Action Items
${summary.actionItems.map(item => `• ${item}`).join('\n')}

## 🧠 Quiz
${summary.quiz.map((q, i) => `
${i + 1}. ${q.question}
   a) ${q.options[0]}
   b) ${q.options[1]}
   c) ${q.options[2]}
   d) ${q.options[3]}
   
   Jawaban: ${String.fromCharCode(97 + q.correct)}
`).join('\n')}

## 📚 Topik Lanjutan
${summary.followUpTopics.map(topic => `• ${topic}`).join('\n')}

## 🔗 Sumber Belajar
${summary.resources.map(resource => `• ${resource}`).join('\n')}

## 🚀 Langkah Selanjutnya
${summary.nextSteps.map(step => `• ${step}`).join('\n')}
    `
    
    const blob = new Blob([summaryText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ringkasan-${sessionData.topic.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Session Info Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ringkasan Sesi
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {sessionData.duration}m
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {sessionData.participants}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{sessionData.topic}</h3>
              <p className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button 
              onClick={generateSummary}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Brain className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Content */}
      {summary && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>AI Generated Summary</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadSummary}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="keypoints" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="followup">Follow Up</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="keypoints" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Poin Penting
                    </h4>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Action Items
                    </h4>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {summary.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quiz">
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {summary.quiz.map((q, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <h5 className="font-semibold mb-3">{index + 1}. {q.question}</h5>
                          <div className="grid gap-2">
                            {q.options.map((option, optIndex) => (
                              <div 
                                key={optIndex} 
                                className={`p-2 rounded text-sm ${
                                  optIndex === q.correct 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                    : 'bg-muted'
                                }`}
                              >
                                <span className="font-semibold mr-2">
                                  {String.fromCharCode(97 + optIndex)})
                                </span>
                                {option}
                                {optIndex === q.correct && (
                                  <CheckCircle className="h-4 w-4 inline ml-2 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="followup">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      Topik Lanjutan
                    </h4>
                    <ul className="space-y-2">
                      {summary.followUpTopics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-orange-500" />
                      Langkah Selanjutnya
                    </h4>
                    <ul className="space-y-2">
                      {summary.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    Sumber Belajar Tambahan
                  </h4>
                  <ul className="space-y-2">
                    {summary.resources.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}