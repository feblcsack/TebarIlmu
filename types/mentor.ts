export interface MentorSchedule {
    id: string;
    mentorId: string;
    mentorName: string;
    mentorEmail: string;
    subject: string;
    date: string; // YYYY-MM-DD format
    timeSlot: string; // "09:00-10:00" format
    isAvailable: boolean;
    maxStudents: number;
    currentStudents: number;
    jitsiRoomId: string;
    description?: string;
    createdAt: Date;
  }
  
  export interface BookingSession {
    id: string;
    scheduleId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    mentorId: string;
    subject: string;
    date: string;
    timeSlot: string;
    jitsiRoomId: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: Date;
  }
  
  export interface Mentor {
    id: string;
    name: string;
    email: string;
    subjects: string[];
    bio: string;
    experience: string;
    rating: number;
    totalSessions: number;
    isActive: boolean;
    createdAt: Date;
  }