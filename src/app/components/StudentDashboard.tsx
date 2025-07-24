'use client'

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Calendar, Clock, User, Video, BookOpen } from "lucide-react"
import { MentorService } from "@/../services/mentorService"
import { BookingSession } from "@/../types/mentor"

export function StudentDashboard() {
  const [bookings, setBookings] = useState<BookingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock student ID - in real app, get from auth context
  const studentId = "demo-student-123"

  useEffect(() => {
    loadStudentBookings()
  }, [])

  const loadStudentBookings = async () => {
    setIsLoading(true)
    try {
      const userBookings = await MentorService.getUserBookings(studentId)
      setBookings(userBookings)
    } catch (error) {
      console.error("Error loading bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openJitsiMeeting = (roomId: string) => {
    const jitsiUrl = `https://meet.jit.si/${roomId}`
    window.open(jitsiUrl, '_blank')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'completed':
        return 'text-blue-400'
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Dikonfirmasi'
      case 'pending':
        return 'Menunggu'
      case 'completed':
        return 'Selesai'
      case 'cancelled':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  const isSessionActive = (date: string, timeSlot: string) => {
    const now = new Date()
    const sessionDate = new Date(date)
    const [startTime, endTime] = timeSlot.split('-')
    
    const sessionStart = new Date(sessionDate)
    const [startHour, startMinute] = startTime.split(':').map(Number)
    sessionStart.setHours(startHour, startMinute, 0, 0)
    
    const sessionEnd = new Date(sessionDate)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    sessionEnd.setHours(endHour, endMinute, 0, 0)
    
    return now >= sessionStart && now <= sessionEnd
  }

  const isSessionUpcoming = (date: string, timeSlot: string) => {
    const now = new Date()
    const sessionDate = new Date(date)
    const [startTime] = timeSlot.split('-')
    
    const sessionStart = new Date(sessionDate)
    const [startHour, startMinute] = startTime.split(':').map(Number)
    sessionStart.setHours(startHour, startMinute, 0, 0)
    
    const timeDiff = sessionStart.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    return hoursDiff > 0 && hoursDiff <= 24 // Within next 24 hours
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard Siswa</h1>
          <p className="text-gray-400 mt-2">Kelola sesi belajar Anda</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sesi</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Dikonfirmasi</p>
                <p className="text-2xl font-bold text-green-400">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Selesai</p>
                <p className="text-2xl font-bold text-blue-400">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <User className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Aktif Sekarang</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bookings.filter(b => 
                    b.status === 'confirmed' && 
                    isSessionActive(b.date, b.timeSlot)
                  ).length}
                </p>
              </div>
              <Video className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Sesi Belajar Anda</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Memuat sesi belajar...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Belum ada sesi belajar yang dibooking.</p>
              <p className="text-gray-500 text-sm mt-2">Cari mentor di halaman utama untuk memulai belajar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-semibold text-yellow-400">
                          {booking.subject.charAt(0).toUpperCase() + booking.subject.slice(1).replace('-', ' ')}
                        </h3>
                        <span className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                        {isSessionActive(booking.date, booking.timeSlot) && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                        {isSessionUpcoming(booking.date, booking.timeSlot) && (
                          <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                            SEGERA
                          </span>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">Mentor: {booking.mentorId}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{booking.timeSlot}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Room ID: {booking.jitsiRoomId}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === 'confirmed' && (
                        <Button
                          onClick={() => openJitsiMeeting(booking.jitsiRoomId)}
                          className={`${
                            isSessionActive(booking.date, booking.timeSlot)
                              ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white font-medium`}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          {isSessionActive(booking.date, booking.timeSlot) 
                            ? 'Join Now!' 
                            : 'Join Meeting'
                          }
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                        onClick={() => {
                          navigator.clipboard.writeText(booking.jitsiRoomId)
                          alert('Room ID telah disalin ke clipboard!')
                        }}
                      >
                        Copy Room ID
                      </Button>
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