'use client'

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Calendar, Clock, Users, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { MentorService } from "@/../services/mentorService"
import { MentorSchedule } from "@/../types/mentor"

export function MentorDashboard() {
  const [schedules, setSchedules] = useState<MentorSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    mentorName: "",
    mentorEmail: "",
    subject: "",
    date: "",
    timeSlot: "",
    maxStudents: 1,
    description: ""
  })

  const subjects = [
    "matematika", "fisika", "biologi", "sejarah", 
    "bahasa-inggris", "kimia", "ekonomi", "geografi"
  ]

  const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
    "19:00-20:00", "20:00-21:00"
  ]

  // Mock mentor ID - in real app, get from auth context
  const mentorId = "demo-mentor-123"

  useEffect(() => {
    loadMentorSchedules()
  }, [])

  const loadMentorSchedules = async () => {
    setIsLoading(true)
    try {
      // Panggil fungsi baru yang lebih tepat
      const mentorSchedules = await MentorService.getSchedulesByMentorId(mentorId)
      
      // Filter di sisi klien tidak diperlukan lagi karena database sudah melakukannya
      setSchedules(mentorSchedules)
  
    } catch (error) {
      console.error("Error loading schedules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.mentorName || !formData.subject || !formData.date || !formData.timeSlot) {
      alert("Mohon lengkapi semua field yang wajib diisi!")
      return
    }

    setIsLoading(true)
    try {
      const scheduleData = {
        mentorId,
        mentorName: formData.mentorName,
        mentorEmail: formData.mentorEmail,
        subject: formData.subject,
        date: formData.date,
        timeSlot: formData.timeSlot,
        maxStudents: formData.maxStudents,
        description: formData.description,
        isAvailable: true,
        jitsiRoomId: "", // atau generate string unik kalau mau
        currentStudents: 0, // default awal
      }

      await MentorService.addSchedule(scheduleData)
      
      // Reset form
      setFormData({
        mentorName: "",
        mentorEmail: "",
        subject: "",
        date: "",
        timeSlot: "",
        maxStudents: 1,
        description: ""
      })
      
      setShowAddForm(false)
      await loadMentorSchedules()
      
      alert("Jadwal berhasil ditambahkan!")
    } catch (error) {
      console.error("Error adding schedule:", error)
      alert("Gagal menambahkan jadwal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const openJitsiMeeting = (roomId: string) => {
    const jitsiUrl = `https://meet.jit.si/${roomId}`
    window.open(jitsiUrl, '_blank')
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">Mentor Dashboard</h1>
            <p className="text-gray-400 mt-2">Kelola jadwal mengajar Anda</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="bg-gradient-to-br from-zinc-900 to-neutral-900 rounded-2xl border border-zinc-700 shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-semibold text-white mb-6 tracking-tight">
            Tambah Jadwal Mengajar
          </h2>
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nama Mentor
                </label>
                <Input
                  value={formData.mentorName}
                  onChange={(e) => handleInputChange("mentorName", e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.mentorEmail}
                  onChange={(e) => handleInputChange("mentorEmail", e.target.value)}
                  placeholder="email@example.com"
                  className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                />
              </div>
            </div>
        
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Mata Pelajaran
                </label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-600">
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="text-white hover:bg-zinc-700">
                        {subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={getTodayDate()}
                  className="bg-zinc-800 border-zinc-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Waktu
                </label>
                <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-600">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} className="text-white hover:bg-zinc-700">
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Maksimal Siswa
                </label>
                <Input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
              </div>
            </div>
        
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Deskripsi (Opsional)
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Jelaskan topik yang akan dibahas..."
                className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400"
                rows={3}
              />
            </div>
        
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-md"
              >
                {isLoading ? "Menyimpan..." : "Simpan Jadwal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-zinc-600 text-zinc-300 bg-zinc-800 hover:text-white hover:bg-zinc-700"
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
        
        
        )}

        {/* Existing Schedules */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Jadwal Mengajar Anda</h2>
          
          {isLoading && !showAddForm ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Memuat jadwal...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Belum ada jadwal mengajar.</p>
              <p className="text-gray-500 text-sm mt-2">Klik "Tambah Jadwal" untuk membuat jadwal baru.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {schedules.map((schedule) => (
    <div
      key={schedule.id}
      className="bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-lg transition hover:shadow-2xl"
    >
      {/* Header: Subject & Mentor */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-yellow-400 tracking-tight">
            {schedule.subject.charAt(0).toUpperCase() +
              schedule.subject.slice(1).replace("-", " ")}
          </h3>
          <p className="text-sm text-zinc-400">{schedule.mentorName}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-400">
            {schedule.currentStudents}/{schedule.maxStudents}
          </span>
        </div>
      </div>

      {/* Date & Time */}
      <div className="space-y-2 mt-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-300">
            {new Date(schedule.date).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-300">{schedule.timeSlot}</span>
        </div>
      </div>

      {/* Deskripsi */}
      {schedule.description && (
        <div className="mt-4">
          <p className="text-sm text-zinc-400">{schedule.description}</p>
        </div>
      )}

      {/* Status & Meeting */}
      <div className="pt-5 mt-5 border-t border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-zinc-400">Status:</span>
          <span
            className={`text-sm font-medium ${
              schedule.isAvailable ? "text-green-400" : "text-red-400"
            }`}
          >
            {schedule.isAvailable ? "Tersedia" : "Penuh"}
          </span>
        </div>

        <Button
  onClick={() => openJitsiMeeting(schedule.jitsiRoomId)}
  size="sm"
  className="w-full px-4 py-2 font-semibold text-white backdrop-blur-md bg-gradient-to-r from-zinc-700/30 via-neutral-800/30 to-zinc-900/30 hover:from-zinc-700/50 hover:to-zinc-900/50 border border-white/10 rounded-xl shadow-md transition-all duration-300"
>
  Buka Meeting Room
</Button>



        <div className="mt-2 text-xs text-zinc-500 text-center tracking-tight">
          Room ID: {schedule.jitsiRoomId}
        </div>
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </div>
    </div>
  )
}