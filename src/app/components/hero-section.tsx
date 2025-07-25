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
    { value: "math", label: "Math" },
    { value: "physics", label: "Physics" },
    { value: "biology", label: "Biology" },
    { value: "history", label: "History" },
    { value: "english", label: "English" },
    { value: "chemistry", label: "Chemistry" },
    { value: "economy", label: "Economy" },
    { value: "geography", label: "Geography" }
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
    <section className="relative py-20 md:py-32 bg-zinc-950 text-white">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center text-center space-y-12">

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Find Your Perfect
            <span className="text-zinc-100 bg-gradient-to-r from-zinc-300 via-zinc-100 to-white bg-clip-text text-transparent">
              {" "}
              Tutor
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
          Empowering Education, No Cost. Just Connection.
          </p>
        </div>
  
        <div className="w-full max-w-md space-y-4">
          <div className="relative">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full h-12 border border-zinc-700 bg-zinc-800/50 backdrop-blur-md text-white rounded-xl focus:ring-2 focus:ring-white/30">
                <SelectValue placeholder="Mau belajar apa?" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800/60 backdrop-blur-md text-white border border-zinc-700 shadow-lg rounded-xl">
                <SelectGroup>
                  <SelectLabel className="text-zinc-400 px-2 py-1 text-sm">Kategori</SelectLabel>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value} className="hover:bg-zinc-700/40">
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            size="lg"
            className="w-full h-12 text-white bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-700 hover:brightness-110 font-medium backdrop-blur-md border border-white/10 shadow-md rounded-xl transition-all"
            onClick={handleFindMentor}
            disabled={isLoading || !selectedSubject}
          >
            {isLoading ? "Searching Mentor..." : "Find a Mentor"}
          </Button>
        </div>
  
        {showTutors && (
          <div className="w-full max-w-4xl mt-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100">
              Mentor available for {subjects.find((s) => s.value === selectedSubject)?.label}
            </h2>
  
            {availableTutors.length === 0 ? (
              <div className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-6 text-center backdrop-blur-md">
                <p className="text-zinc-400">
                  No mentor is available for this subject right now.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {availableTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{tutor.mentorName}</h3>
                        <p className="text-zinc-400 text-sm">{tutor.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-500">
                          {tutor.currentStudents}/{tutor.maxStudents} students
                        </p>
                      </div>
                    </div>
  
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Date:</span>
                        <span className="text-zinc-300">{formatDate(tutor.date)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">Time:</span>
                        <span className="text-zinc-300">{tutor.timeSlot}</span>
                      </div>
                      {tutor.description && (
                        <p className="mt-2 text-sm text-zinc-400">{tutor.description}</p>
                      )}
                    </div>
  
                    <div className="flex gap-2 pt-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-800 hover:brightness-110 text-white font-medium border border-white/10 backdrop-blur-md shadow"
                        onClick={() => handleBookSession(tutor.id)}
                        disabled={tutor.currentStudents >= tutor.maxStudents}
                      >
                        {tutor.currentStudents >= tutor.maxStudents ? "Penuh" : "Book Session"}
                      </Button>
                      <Button
                        variant="outline"
                        className="px-4 border border-zinc-600 text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/60 backdrop-blur-md"
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
  {[
    {
      icon: <Users className="h-6 w-6 text-zinc-200" />,
      value: "100%",
      label: "Free Access",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-zinc-200" />,
      value: "Jitsi-Based",
      label: "Live Learning Sessions",
    },
    {
      icon: <Award className="h-6 w-6 text-zinc-200" />,
      value: "For All",
      label: "No Background Needed",
    },
  ].map((stat, i) => (
    <div key={i} className="flex flex-col items-center space-y-2">
      <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-md">
        {stat.icon}
      </div>
      <div className="text-2xl font-bold text-white">{stat.value}</div>
      <div className="text-sm text-zinc-400">{stat.label}</div>
    </div>
  ))}
</div>

      </div>
    </div>
  </section>
  
  )
}