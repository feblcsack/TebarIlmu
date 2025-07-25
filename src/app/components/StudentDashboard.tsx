'use client'

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Calendar, Clock, User, Video, BookOpen, AlertCircle } from "lucide-react"
import { MentorService } from "@/../services/mentorService"
import { BookingSession } from "@/../types/mentor"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../lib/firebase'

export function StudentDashboard() {
  const [bookings, setBookings] = useState<BookingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      loadStudentBookings()
    } else if (!loading) {
      setIsLoading(false)
    }
  }, [user, loading])

  const loadStudentBookings = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Use actual user ID instead of mock data
      const userBookings = await MentorService.getUserBookings(user.uid)
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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'completed':
        return 'text-blue-600 bg-blue-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'pending':
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
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
    
    return hoursDiff > 0 && hoursDiff <= 24 
  }

  const cancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    
    try {
      await MentorService.cancelBooking(bookingId)
      alert("Booking cancelled successfully!")
      await loadStudentBookings() // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
    }
  }

  // Show loading or authentication required state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to log in to view your student dashboard.</p>
          <Button className="bg-black hover:bg-gray-800 text-white">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your learning sessions</p>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user.displayName || user.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-black">{bookings.length}</p>
              </div>
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <User className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Now</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => 
                    b.status === 'confirmed' && 
                    isSessionActive(b.date, b.timeSlot)
                  ).length}
                </p>
              </div>
              <Video className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-black">Your Learning Sessions</h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No learning sessions booked yet.</p>
              <p className="text-gray-500 text-sm">Find mentors on the main page to start learning.</p>
              <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
                Find a Mentor
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      {/* Subject + Status */}
                      <div className="flex items-center flex-wrap gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-black">
                          {booking.subject.charAt(0).toUpperCase() +
                            booking.subject.slice(1).replace("-", " ")}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>

                        {isSessionActive(booking.date, booking.timeSlot) && (
                          <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse font-semibold">
                            LIVE
                          </span>
                        )}

                        {isSessionUpcoming(booking.date, booking.timeSlot) && (
                          <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            SOON
                          </span>
                        )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Mentor: {booking.mentorId}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{booking.timeSlot}</span>
                        </div>
                      </div>

                      {/* Room ID */}
                      <div className="mt-3 text-xs text-gray-500">
                        Room ID: {booking.jitsiRoomId}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {booking.status === "confirmed" && (
                        <Button
                          onClick={() => openJitsiMeeting(booking.jitsiRoomId)}
                          className={`flex items-center gap-2 font-medium transition-all ${
                            isSessionActive(booking.date, booking.timeSlot)
                              ? "bg-red-600 hover:bg-red-700 animate-pulse text-white"
                              : "bg-black hover:bg-gray-800 text-white"
                          }`}
                        >
                          <Video className="h-4 w-4" />
                          {isSessionActive(booking.date, booking.timeSlot) ? "Join Now!" : "Join Meeting"}
                        </Button>
                      )}

                      {booking.status === "confirmed" && (
                        <Button
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          navigator.clipboard.writeText(booking.jitsiRoomId);
                          alert("Room ID copied to clipboard!");
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