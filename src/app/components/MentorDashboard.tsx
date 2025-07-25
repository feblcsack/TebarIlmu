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
    "english", "chemistry", "economy", "geography"
  ]

  const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
    "19:00-20:00", "20:00-21:00"
  ]

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
      alert("Please fill in all required fields!")
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
      
      alert("Schedule added successfully!")
    } catch (error) {
      console.error("Error adding schedule:", error)
      alert("Failed to add schedule. Please try again.")
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Mentor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your teaching schedule</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add Teaching Schedule
            </h2>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentor Name *
                  </label>
                  <Input
                    value={formData.mentorName}
                    onChange={(e) => handleInputChange("mentorName", e.target.value)}
                    placeholder="Enter your name"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.mentorEmail}
                    onChange={(e) => handleInputChange("mentorEmail", e.target.value)}
                    placeholder="your@email.com"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
          
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject.charAt(0).toUpperCase() + subject.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getTodayDate()}
                    className="border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
          
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students
                  </label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
          
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the session..."
                  className="border-gray-300 focus:border-black focus:ring-black"
                  rows={3}
                />
              </div>
          
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isLoading ? "Saving..." : "Save Schedule"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Schedules */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Teaching Schedule</h2>
          
          {isLoading && !showAddForm ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No teaching schedules yet.</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Schedule" to create your first schedule.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {schedule.subject.charAt(0).toUpperCase() + schedule.subject.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-600">{schedule.mentorName}</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {schedule.currentStudents}/{schedule.maxStudents}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {new Date(schedule.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{schedule.timeSlot}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {schedule.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        {schedule.description}
                      </p>
                    </div>
                  )}

                  {/* Status & Actions */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          schedule.isAvailable 
                            ? "text-green-700 bg-green-100" 
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {schedule.isAvailable ? "Available" : "Full"}
                      </span>
                    </div>

                    <Button
                      onClick={() => openJitsiMeeting(schedule.jitsiRoomId)}
                      size="sm"
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      Open Meeting Room
                    </Button>

                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Room: {schedule.jitsiRoomId}
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