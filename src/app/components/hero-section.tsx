'use client'

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Users, BookOpen, Award, AlertTriangle } from "lucide-react"
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
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../lib/firebase'

export function HeroSection() {
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [availableTutors, setAvailableTutors] = useState<MentorSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTutors, setShowTutors] = useState(false)
  const [showLoginWarning, setShowLoginWarning] = useState(false)
  const [userHasBooking, setUserHasBooking] = useState(false)
  
  const [user, loading] = useAuthState(auth)

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

  // Check if user already has a booking
  useEffect(() => {
    if (user) {
      checkUserBookingStatus()
    } else {
      setUserHasBooking(false)
    }
  }, [user])

  const checkUserBookingStatus = async () => {
    if (!user) return
    
    try {
      const bookings = await MentorService.getUserBookings(user.uid)
      setUserHasBooking(bookings.length > 0)
    } catch (error) {
      console.error("Error checking user bookings:", error)
      setUserHasBooking(false)
    }
  }

  const handleFindMentor = async () => {
    if (!user) {
      setShowLoginWarning(true)
      setTimeout(() => setShowLoginWarning(false), 5000)
      return
    }

    if (!selectedSubject) {
      alert("Please select a subject first!")
      return
    }

    setIsLoading(true)
    try {
      // Filter out schedules created by the current user (mentor can't book their own sessions)
      const allTutors = await MentorService.getAvailableTutors(selectedSubject)
      const tutors = allTutors.filter(tutor => tutor.mentorId !== user.uid)
      
      setAvailableTutors(tutors)
      setShowTutors(true)
    } catch (error) {
      console.error("Error finding tutors:", error)
      alert("Error finding mentors. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSession = async (scheduleId: string) => {
    if (!user) {
      alert("You must log in first to book a session!")
      return
    }

    // Check if user already has a booking
    if (userHasBooking) {
      alert("You already have an active booking. You can only book one session at a time.")
      return
    }

    // Confirm booking
    const confirmed = window.confirm("Are you sure you want to book this session?")
    if (!confirmed) return

    try {
      const bookingId = await MentorService.bookSession(
        scheduleId, 
        user.uid, 
        user.displayName || "Student", 
        user.email || ""
      )
      
      alert(`Session booked successfully! Booking ID: ${bookingId}`)
      
      // Update user booking status
      setUserHasBooking(true)
      
      // Refresh the tutor list to show updated availability
      const allTutors = await MentorService.getAvailableTutors(selectedSubject)
      const tutors = allTutors.filter(tutor => tutor.mentorId !== user.uid)
      setAvailableTutors(tutors)
    } catch (error) {
      console.error("Error booking session:", error)
      alert("Failed to book session. Please try again.")
    }
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

  const openJitsiMeeting = (roomId: string) => {
    if (!user) {
      alert("You must log in first to join the meeting!")
      return
    }
    
    const jitsiUrl = `https://meet.jit.si/${roomId}`
    window.open(jitsiUrl, '_blank')
  }

  const isSearchDisabled = !user || loading || isLoading || !selectedSubject

  return (
    <section className="py-20 md:py-32 bg-white text-black">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-12">

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-900 bg-clip-text text-transparent">
                {" "}
                Tutor
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Empowering Education, No Cost. Just Connection.
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full h-12 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-black/20 focus:border-black">
                <SelectValue placeholder="What subject do you want to learn?" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border border-gray-200 rounded-lg">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 px-2 py-1 text-sm">Category</SelectLabel>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value} className="hover:bg-gray-100">
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button
              size="lg"
              className={`w-full h-12 font-medium rounded-lg transition-all ${
                isSearchDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
              onClick={handleFindMentor}
              disabled={isSearchDisabled}
            >
              {loading ? "Loading..." : isLoading ? "Searching..." : "Find a Mentor"}
            </Button>

            {/* Booking Status Warning */}
            {userHasBooking && user && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>You already have an active booking. Check your dashboard to manage it.</span>
              </div>
            )}

            {/* Login Warning */}
            {showLoginWarning && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>You must log in first to search for mentors!</span>
              </div>
            )}

            {/* Authentication Status */}
            {!loading && (
              <div className="text-xs text-center">
                {user ? (
                  <span className="text-green-600">✓ Logged in as {user.displayName || user.email}</span>
                ) : (
                  <span className="text-red-600">Login required to search for mentors</span>
                )}
              </div>
            )}
          </div>

          {showTutors && user && (
            <div className="w-full max-w-4xl mt-12">
              <h2 className="text-2xl font-bold mb-6 text-black">
                Available mentors for {subjects.find((s) => s.value === selectedSubject)?.label}
              </h2>

              {availableTutors.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      No mentors available for this subject right now.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Try selecting a different subject or check back later.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {availableTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-black">{tutor.mentorName}</h3>
                          <p className="text-gray-600 text-sm capitalize">{tutor.subject}</p>
                          {tutor.mentorEmail && (
                            <p className="text-gray-500 text-xs">{tutor.mentorEmail}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600">
                              {tutor.currentStudents}/{tutor.maxStudents}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Date:</span>
                          <span className="text-gray-800">{formatDate(tutor.date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Time:</span>
                          <span className="text-gray-800">{tutor.timeSlot}</span>
                        </div>
                        {tutor.description && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {tutor.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1 bg-black hover:bg-gray-800 text-white"
                          onClick={() => handleBookSession(tutor.id)}
                          disabled={tutor.currentStudents >= tutor.maxStudents || userHasBooking}
                        >
                          {tutor.currentStudents >= tutor.maxStudents 
                            ? "Full" 
                            : userHasBooking 
                            ? "Already Booked" 
                            : "Book Session"}
                        </Button>
                        <Button
                          variant="outline"
                          className="px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
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

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-2xl">
            {[
              {
                icon: <Users className="h-6 w-6 text-black" />,
                value: "100%",
                label: "Free Access",
              },
              {
                icon: <BookOpen className="h-6 w-6 text-black" />,
                value: "Live",
                label: "Learning Sessions",
              },
              {
                icon: <Award className="h-6 w-6 text-black" />,
                value: "For All",
                label: "No Requirements",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}