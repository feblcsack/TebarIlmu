// services/mentorService.ts
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    doc,
    getDoc,
    orderBy,
    Timestamp,
    QueryConstraint // Tipe untuk menampung semua jenis constraint
  } from 'firebase/firestore';
  import { db } from '../lib/firebase'; // Pastikan path ini benar
  import { MentorSchedule, BookingSession } from '../types/mentor';
  
  export class MentorService {
    /**
     * Mengambil jadwal mentor yang tersedia berdasarkan mata pelajaran dan tanggal (opsional).
     * Jadwal yang diambil adalah yang akan datang dan slotnya masih tersedia.
     */
    static async getAvailableTutors(subject: string, date?: string): Promise<MentorSchedule[]> {
      try {
        // Kumpulan kondisi untuk query, dibangun secara dinamis
        const constraints: QueryConstraint[] = [
          where('subject', '==', subject),
          where('isAvailable', '==', true),
        ];
  
        // PERBAIKAN: Logika yang lebih aman untuk menambahkan filter tanggal
        if (date) {
          // Jika tanggal spesifik diberikan, cari tanggal yang sama persis
          constraints.push(where('date', '==', date));
        } else {
          // Jika tidak ada tanggal, cari jadwal mulai hari ini dan seterusnya
          const today = new Date().toISOString().split('T')[0];
          constraints.push(where('date', '>=', today));
        }
        
        // Tambahkan pengurutan
        constraints.push(orderBy('date'), orderBy('timeSlot'));
  
        const q = query(collection(db, 'mentorSchedules'), ...constraints);
        const querySnapshot = await getDocs(q);
        
        const schedules: MentorSchedule[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          schedules.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()
          } as MentorSchedule);
        });
  
        // Filter tambahan di sisi klien untuk jadwal hari ini yang waktunya sudah lewat
        const now = new Date();
        const todayString = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
        return schedules.filter(schedule => {
          if (schedule.date > todayString) return true;
          if (schedule.date === todayString) {
            const scheduleStartTime = schedule.timeSlot.split('-')[0];
            return scheduleStartTime > currentTime;
          }
          return false;
        });
  
      } catch (error) {
        console.error('Error getting available tutors:', error);
        throw error;
      }
    }
  
    /**
     * FUNGSI BARU: Mengambil semua jadwal yang dibuat oleh mentor tertentu.
     * Ini adalah fungsi yang seharusnya digunakan di Mentor Dashboard.
     */
    static async getSchedulesByMentorId(mentorId: string): Promise<MentorSchedule[]> {
      try {
        const q = query(
          collection(db, 'mentorSchedules'),
          where('mentorId', '==', mentorId),
          orderBy('date', 'desc'), // Urutkan dari yang terbaru
          orderBy('timeSlot')
        );
  
        const querySnapshot = await getDocs(q);
        const schedules: MentorSchedule[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          schedules.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()
          } as MentorSchedule);
        });
  
        return schedules;
      } catch (error) {
        console.error(`Error getting schedules for mentor ${mentorId}:`, error);
        throw error;
      }
    }
  
    /**
     * Memesan sesi dengan seorang mentor.
     */
    static async bookSession(
      scheduleId: string, 
      studentId: string, 
      studentName: string, 
      studentEmail: string
    ): Promise<string> {
      try {
        const scheduleRef = doc(db, 'mentorSchedules', scheduleId);
        const scheduleSnapshot = await getDoc(scheduleRef);
        
        if (!scheduleSnapshot.exists()) {
          throw new Error('Schedule not found');
        }
  
        const scheduleData = scheduleSnapshot.data() as MentorSchedule;
        
        if (scheduleData.currentStudents >= scheduleData.maxStudents) {
          throw new Error('This session is already full');
        }
  
        const booking: Omit<BookingSession, 'id'> = {
          scheduleId,
          studentId,
          studentName,
          studentEmail,
          mentorId: scheduleData.mentorId,
          subject: scheduleData.subject,
          date: scheduleData.date,
          timeSlot: scheduleData.timeSlot,
          jitsiRoomId: scheduleData.jitsiRoomId,
          status: 'confirmed',
          createdAt: new Date()
        };
  
        const bookingRef = await addDoc(collection(db, 'bookingSessions'), {
          ...booking,
          createdAt: Timestamp.now()
        });
  
        const newStudentCount = scheduleData.currentStudents + 1;
        await updateDoc(scheduleRef, {
          currentStudents: newStudentCount,
          isAvailable: newStudentCount < scheduleData.maxStudents
        });
  
        return bookingRef.id;
      } catch (error) {
        console.error('Error booking session:', error);
        throw error;
      }
    }
  
    /**
     * Menambahkan jadwal baru oleh seorang mentor.
     */
    static async addSchedule(schedule: Omit<MentorSchedule, 'id' | 'createdAt' | 'jitsiRoomId' | 'currentStudents'>): Promise<string> {
      try {
        const jitsiRoomId = `tebar-ilmu-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        const newSchedule = {
          ...schedule,
          jitsiRoomId,
          currentStudents: 0,
          isAvailable: true,
          createdAt: Timestamp.now()
        };
  
        const docRef = await addDoc(collection(db, 'mentorSchedules'), newSchedule);
        return docRef.id;
      } catch (error) {
        console.error('Error adding schedule:', error);
        throw error;
      }
    }
  
    /**
     * Mengambil semua sesi booking yang dimiliki oleh seorang siswa.
     */
    static async getUserBookings(studentId: string): Promise<BookingSession[]> {
      try {
        const q = query(
          collection(db, 'bookingSessions'),
          where('studentId', '==', studentId),
          orderBy('date', 'desc'),
          orderBy('timeSlot')
        );
  
        const querySnapshot = await getDocs(q);
        const bookings: BookingSession[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          bookings.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()
          } as BookingSession);
        });
  
        return bookings;
      } catch (error) {
        console.error('Error getting user bookings:', error);
        throw error;
      }
    }
  }
  