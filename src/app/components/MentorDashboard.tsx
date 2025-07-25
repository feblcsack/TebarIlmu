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
    "math", "physics", "biology", "history", 
    "english", "chemisrty", "economy", "geography"
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
      const mentorSchedules = await MentorService.getSchedulesByMentorId(mentorId)
      
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
        jitsiRoomId: "", 
        currentStudents: 0, 
      }

      await MentorService.addSchedule(scheduleData)
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">
              Mentor Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Manage your teaching schedule</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className=" text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 mb-10 hover:bg-white/80 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 tracking-tight">
              Add teaching schedule
            </h2>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mentor's Name
                  </label>
                  <Input
                    value={formData.mentorName}
                    onChange={(e) => handleInputChange("mentorName", e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 hover:bg-white/70 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.mentorEmail}
                    onChange={(e) => handleInputChange("mentorEmail", e.target.value)}
                    placeholder="johndoe@example.com"
                    className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 hover:bg-white/70 transition-all duration-200"
                  />
                </div>
              </div>
          
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subjects
                  </label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 hover:bg-white/70 transition-all duration-200">
                      <SelectValue placeholder="Choose Subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-slate-200">
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="text-slate-800 hover:bg-indigo-50">
                          {subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getTodayDate()}
                    className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 focus:border-indigo-400 hover:bg-white/70 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time
                  </label>
                  <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 hover:bg-white/70 transition-all duration-200">
                      <SelectValue placeholder="Choose Time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-slate-200">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot} className="text-slate-800 hover:bg-indigo-50">
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
          
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maksimum Student
                  </label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 focus:border-indigo-400 hover:bg-white/70 transition-all duration-200"
                  />
                </div>
              </div>
          
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Example: We are going to discuss why you should learn math."
                  className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 hover:bg-white/70 transition-all duration-200"
                  rows={3}
                />
              </div>
          
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className=" text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-slate-300 text-slate-700 bg-white/50 backdrop-blur-sm hover:text-slate-800 hover:bg-white/80 transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Schedules */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">Your teaching schedule</h2>
          
          {isLoading && !showAddForm ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Memuat jadwal...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 p-8 text-center shadow-lg">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Belum ada jadwal mengajar.</p>
              <p className="text-slate-500 text-sm mt-2">Klik &quot;Tambah Jadwal&quot; untuk membuat jadwal baru.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:bg-white/70 transition-all duration-300 group"
                >
                  {/* Header: Subject & Mentor */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                        {schedule.subject.charAt(0).toUpperCase() +
                          schedule.subject.slice(1).replace("-", " ")}
                      </h3>
                      <p className="text-sm text-slate-600">{schedule.mentorName}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 font-medium">
                        {schedule.currentStudents}/{schedule.maxStudents}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center space-x-3 bg-blue-50/50 backdrop-blur-sm rounded-lg p-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm text-slate-700 font-medium">
                        {new Date(schedule.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 bg-purple-50/50 backdrop-blur-sm rounded-lg p-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-slate-700 font-medium">{schedule.timeSlot}</span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  {schedule.description && (
                    <div className="mt-4 bg-slate-50/50 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm text-slate-600">{schedule.description}</p>
                    </div>
                  )}

                  {/* Status & Meeting */}
                  <div className="pt-5 mt-5 border-t border-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-600 font-medium">Status:</span>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          schedule.isAvailable 
                            ? "text-emerald-700 bg-emerald-100/80 backdrop-blur-sm" 
                            : "text-red-700 bg-red-100/80 backdrop-blur-sm"
                        }`}
                      >
                        {schedule.isAvailable ? "Available" : "Full"}
                      </span>
                    </div>

                    <Button
                      onClick={() => openJitsiMeeting(schedule.jitsiRoomId)}
                      size="sm"
                      className="w-full  backdrop-blur-xl border border-white/30 text-white  rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                    >
                     Open Meeting Room
                    </Button>

                    <div className="mt-3 text-xs text-slate-500 text-center bg-slate-100/50 backdrop-blur-sm rounded-lg py-1 tracking-tight">
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