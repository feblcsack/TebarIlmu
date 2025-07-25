'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { StudentDashboard } from '../components/StudentDashboard'

export default function StudentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/403')
        return
      }

      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        router.replace('/403')
        return
      }

      const role = docSnap.data().role
      if (role === 'siswa') {
        setAuthorized(true)
      } else {
        router.replace('/403')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return authorized ? <StudentDashboard /> : null
}
