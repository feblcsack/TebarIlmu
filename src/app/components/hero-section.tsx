'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Users, BookOpen, Award } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { MentorService } from "@/../services/mentorService"
import { MentorSchedule } from "@/../types/mentor"

export function HeroSection() {
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [availableTutors, setAvailableTutors] = useState<MentorSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTutors, setShowTutors] = useState(false)

  const subjects = [
    { value: "matematika", label: "Matematika" },
    { value: "fisika", label: "Fisika" },
    { value: "biologi", label: "Biologi" },
    { value: "sejarah", label: "Sejarah" },
    { value: "bahasa-inggris", label: "Bahasa Inggris" },
    { value: "kimia", label: "Kimia" },
    { value: "ekonomi", label: "Ekonomi" },
    { value: "geografi", label: "Geografi" }
  ]

  const handleFindMentor = async () => {
    if (!selectedSubject) {
      alert("Silakan pilih mata pelajaran terlebih dahulu!")
      return
    }

    setIsLoading(true)
    try {
      const tutors = await MentorService.getAvailableTutors(selectedSubject)
      setAvailableTutors(tutors)
      setShowTutors(true)
    } catch (error) {
      console.error("Error finding tutors:", error)
      alert("Terjadi kesalahan saat mencari mentor. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSession = async (scheduleId: string) => {
    // For demo purposes, using mock student data
    // In real app, get from authentication context
    const studentId = "demo-student-123"
    const studentName = "Demo Student"
    const studentEmail = "student@demo.com"

    try {
      const bookingId = await MentorService.bookSession(
        scheduleId, 
        studentId, 
        studentName, 
        studentEmail
      )
      alert(`Sesi berhasil dibooking! ID Booking: ${bookingId}`)
      
      // Refresh the tutor list
      const updatedTutors = await MentorService.getAvailableTutors(selectedSubject)
      setAvailableTutors(updatedTutors)
    } catch (error) {
      console.error("Error booking session:", error)
      alert("Gagal booking sesi. Silakan coba lagi.")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const openJitsiMeeting = (roomId: string) => {
    const jitsiUrl = `https://meet.jit.si/${roomId}`
    window.open(jitsiUrl, '_blank')
  }

  return (
    <section className="relative py-20 md:py-32 bg-black text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* HEADLINE */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="text-yellow-400"> Tutor</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Menyambungkan dan menyamaratakan pendidikan di Indonesia tanpa dipungut biaya.
            </p>
          </div>

          {/* SELECT + BUTTON */}
          <div className="w-full max-w-md space-y-4">
            <div className="relative">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full h-12 border border-gray-700 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-yellow-400">
                  <SelectValue placeholder="Mau belajar apa?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border border-gray-700 shadow-md rounded-md">
                  <SelectGroup>
                    <SelectLabel className="text-gray-400 px-2 py-1 text-sm">Kategori</SelectLabel>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              size="lg"
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-base"
              onClick={handleFindMentor}
              disabled={isLoading || !selectedSubject}
            >
              {isLoading ? "Mencari Mentor..." : "Find a Mentor"}
            </Button>
          </div>

          {/* AVAILABLE TUTORS SECTION */}
          {showTutors && (
            <div className="w-full max-w-4xl mt-12">
              <h2 className="text-2xl font-bold mb-6">
                Mentor Tersedia untuk {subjects.find(s => s.value === selectedSubject)?.label}
              </h2>
              
              {availableTutors.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    Tidak ada mentor yang tersedia saat ini untuk mata pelajaran ini.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {availableTutors.map((tutor) => (
                    <div key={tutor.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-400">
                            {tutor.mentorName}
                          </h3>
                          <p className="text-gray-300 text-sm">{tutor.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {tutor.currentStudents}/{tutor.maxStudents} siswa
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Tanggal:</span>
                          <span className="text-white">{formatDate(tutor.date)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Waktu:</span>
                          <span className="text-white">{tutor.timeSlot}</span>
                        </div>
                        {tutor.description && (
                          <div className="mt-3">
                            <p className="text-gray-300 text-sm">{tutor.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                          onClick={() => handleBookSession(tutor.id)}
                          disabled={tutor.currentStudents >= tutor.maxStudents}
                        >
                          {tutor.currentStudents >= tutor.maxStudents ? "Penuh" : "Book Session"}
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                          onClick={() => openJitsiMeeting(tutor.jitsiRoomId)}
                        >
                          Join Meet
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATISTICS */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-2xl">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Expert Tutors</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">8+</div>
              <div className="text-sm text-gray-400">Subjects</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}